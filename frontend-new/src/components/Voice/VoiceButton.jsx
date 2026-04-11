"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { matchIntent } from "@/lib/voice/intentMatcher";
import { executeDataQuery } from "@/lib/voice/commandExecutor";
import VoicePanel from "./VoicePanel";

const SILENCE_TIMEOUT = 8000;
const WAKE_WORDS = ["hey mytime", "hi mytime", "hey my time", "hi my time"];

export default function VoiceButton() {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [voiceState, setVoiceState] = useState("idle"); // idle | waiting | listening | processing
  const [transcript, setTranscript] = useState("");
  const [debugLog, setDebugLog] = useState([]);

  const { speak } = useTextToSpeech();
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const stateRef = useRef("idle");
  const manualStopRef = useRef(false);
  const panelOpenRef = useRef(false);
  const startListeningRef = useRef(null);

  const isSupported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const addDebug = useCallback((msg) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setDebugLog((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 20));
    console.log(`[Voice] ${msg}`);
  }, []);

  const addToHistory = useCallback((command) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => [{ command, time }, ...prev].slice(0, 5));
  }, []);

  const playStartSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    clearSilenceTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setVoiceState("idle");
    stateRef.current = "idle";
    addDebug("Stopped listening");
  }, [clearSilenceTimer, addDebug]);

  // After command finishes, restart listening for next command
  const restartListening = useCallback(() => {
    setTimeout(() => {
      if (panelOpenRef.current) {
        addDebug("Ready for next command - say 'Hey MyTime' or click mic");
        startListeningRef.current?.(false); // restart with wake word mode
      }
    }, 2000); // Wait 2s for TTS to finish
  }, [addDebug]);

  const processCommand = useCallback(async (text) => {
    addToHistory(text);
    setVoiceState("processing");
    stateRef.current = "processing";
    addDebug(`Processing: "${text}"`);

    const intent = matchIntent(text);

    if (!intent) {
      addDebug("No intent matched");
      const errorResult = {
        speech: "Sorry, I didn't understand that. Try saying 'show today absent list' or 'open attendance'.",
        data: null,
        label: "Not Understood",
        type: "error",
      };
      setResult(errorResult);
      speak(errorResult.speech);
      setVoiceState("idle");
      stateRef.current = "idle";
      restartListening();
      return;
    }

    addDebug(`Intent: ${intent.type} - ${intent.command.label || intent.command.response?.substring(0, 30)}`);

    if (intent.type === "navigate") {
      const navResult = {
        speech: `Navigating to ${intent.command.label}.`,
        label: intent.command.label,
        type: "navigate",
      };
      setResult(navResult);
      speak(navResult.speech);
      router.push(intent.command.route);
      setVoiceState("idle");
      stateRef.current = "idle";
      restartListening();
      return;
    }

    if (intent.type === "greeting") {
      setResult({
        speech: intent.command.response,
        label: "Assistant",
        type: "greeting",
        data: null,
      });
      speak(intent.command.response);
      setVoiceState("idle");
      stateRef.current = "idle";
      restartListening();
      return;
    }

    if (intent.type === "query") {
      try {
        const queryResult = await executeDataQuery(intent.command);
        setResult(queryResult);
        speak(queryResult.speech);
        addDebug(`Query result: ${queryResult.label}`);
      } catch (e) {
        addDebug(`Query error: ${e.message}`);
        setResult({
          speech: "Sorry, there was an error processing your request.",
          label: "Error",
          type: "error",
        });
      }
      setVoiceState("idle");
      stateRef.current = "idle";
      restartListening();
    }
  }, [addToHistory, addDebug, speak, router, restartListening]);

  const startListening = useCallback(async (skipWakeWord = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addDebug("Speech recognition not supported in this browser");
      setResult({
        speech: "Speech recognition is not supported in this browser. Please use Chrome.",
        label: "Not Supported",
        type: "error",
      });
      return;
    }

    // Request mic permission explicitly first
    try {
      addDebug("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Got permission - stop the stream immediately (Speech API will handle its own)
      stream.getTracks().forEach((t) => t.stop());
      addDebug("Microphone permission granted");
    } catch (err) {
      addDebug(`Microphone permission denied: ${err.message}`);
      setResult({
        speech: "Microphone access was denied. Please allow microphone permission in your browser and try again.",
        label: "Permission Denied",
        type: "error",
      });
      setVoiceState("idle");
      stateRef.current = "idle";
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    manualStopRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    if (skipWakeWord) {
      setVoiceState("listening");
      stateRef.current = "listening";
      addDebug("Listening for command (mic click - no wake word needed)");
    } else {
      setVoiceState("waiting");
      stateRef.current = "waiting";
      addDebug("Waiting for wake word...");
    }
    setTranscript("");

    // Start silence timer for listening mode
    if (skipWakeWord) {
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        if (stateRef.current === "listening") {
          addDebug("Silence timeout - stopping");
          stopListening();
        }
      }, SILENCE_TIMEOUT);
    }

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      const currentText = finalText || interimText;
      setTranscript(currentText);

      if (stateRef.current === "waiting") {
        // Check for wake word
        const lower = currentText.toLowerCase().trim();
        const hasWakeWord = WAKE_WORDS.some((w) => lower.includes(w));

        if (hasWakeWord) {
          addDebug("Wake word detected!");
          playStartSound();
          setResult(null);
          setVoiceState("listening");
          stateRef.current = "listening";
          setTranscript("");

          // Check if command came with wake word
          let cmdAfterWake = "";
          for (const w of WAKE_WORDS) {
            const idx = lower.indexOf(w);
            if (idx !== -1) {
              cmdAfterWake = lower.substring(idx + w.length).trim();
              break;
            }
          }

          if (cmdAfterWake.length > 2 && finalText) {
            processCommand(cmdAfterWake);
            try { recognition.stop(); } catch {}
          } else {
            // Start silence timer
            clearSilenceTimer();
            silenceTimerRef.current = setTimeout(() => {
              if (stateRef.current === "listening") {
                addDebug("Silence timeout - stopping");
                stopListening();
              }
            }, SILENCE_TIMEOUT);
          }
        }
      } else if (stateRef.current === "listening" && finalText.trim().length > 2) {
        // Got a final command
        addDebug(`Heard: "${finalText.trim()}"`);
        clearSilenceTimer();
        processCommand(finalText.trim());
        try { recognition.stop(); } catch {}
      } else if (stateRef.current === "listening") {
        // Reset silence timer on any speech
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (stateRef.current === "listening") {
            addDebug("Silence timeout - stopping");
            stopListening();
          }
        }, SILENCE_TIMEOUT);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        addDebug(`Recognition event: ${event.error} (normal)`);
        return;
      }
      addDebug(`Recognition error: ${event.error}`);
      if (event.error === "not-allowed") {
        addDebug("Microphone permission denied!");
        stopListening();
      }
    };

    recognition.onend = () => {
      if (!manualStopRef.current && (stateRef.current === "waiting" || stateRef.current === "listening")) {
        addDebug("Recognition ended, restarting...");
        try { recognition.start(); } catch {}
      }
    };

    try {
      recognition.start();
      addDebug("Recognition started");
    } catch (e) {
      addDebug(`Failed to start: ${e.message}`);
    }
  }, [addDebug, playStartSound, clearSilenceTimer, stopListening, processCommand]);

  // Keep refs in sync
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  useEffect(() => {
    panelOpenRef.current = panelOpen;
  }, [panelOpen]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [clearSilenceTimer]);

  if (!isSupported) return null;

  const handleMicClick = () => {
    if (voiceState === "idle") {
      setPanelOpen(true);
      setResult(null);
      // Click = skip wake word, go directly to listening
      startListening(true);
      playStartSound();
    } else {
      stopListening();
      setPanelOpen(false);
    }
  };

  const handleClose = () => {
    stopListening();
    setPanelOpen(false);
  };

  const isActive = voiceState !== "idle";

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Panel */}
      {panelOpen && (
        <VoicePanel
          state={voiceState}
          transcript={transcript}
          result={result}
          history={history}
          debugLog={debugLog}
          onClose={handleClose}
        />
      )}

      {/* Floating Mic Button */}
      <button
        onClick={handleMicClick}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isActive
            ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
            : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/30"
        }`}
      >
        {isActive ? (
          <MicOff size={22} className="text-white" />
        ) : (
          <Mic size={22} className="text-white" />
        )}

        {isActive && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-red-400/40 animate-ping" />
            <span className="absolute -inset-1 rounded-full border border-red-400/20 animate-pulse" />
          </>
        )}

        {!panelOpen && (
          <span className="absolute -top-10 right-0 bg-slate-900 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            {isActive ? "Stop Listening" : "Voice Assistant"}
          </span>
        )}
      </button>
    </div>
  );
}
