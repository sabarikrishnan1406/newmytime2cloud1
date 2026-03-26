"use client";

import { useCallback, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useBrowserNotification } from "@/hooks/useBrowserNotification";
import { useLiveAttendance } from "@/context/LiveAttendanceContext";
import useSse from "@/hooks/useSse";
import { getUser } from "@/config";

export default function LiveAttendanceNotifier() {
  const user = getUser();
  const { showNotification } = useBrowserNotification();
  const { lastAttendanceEvent } = useLiveAttendance();
  const seenEventsRef = useRef(new Map());

  const showAttendanceNotification = useCallback(
    ({ personName, customId, time, pic, punctuality, actionText }) => {
      if (!personName || !time) return;

      const readableAction = actionText || `punched ${punctuality}`;
      const signature = `${customId || "--"}-${personName}-${time}-${readableAction}`;
      const now = Date.now();
      const dedupeWindowMs = 60 * 1000;
      const lastShownAt = seenEventsRef.current.get(signature);
      const isRecentDuplicate =
        typeof lastShownAt === "number" && now - lastShownAt < dedupeWindowMs;

      if (isRecentDuplicate) return;

      seenEventsRef.current.set(signature, now);

      if (seenEventsRef.current.size > 200) {
        for (const [key, shownAt] of seenEventsRef.current) {
          if (now - shownAt > dedupeWindowMs) {
            seenEventsRef.current.delete(key);
          }
        }
      }

      showNotification({
        title: "Attendance Notification",
        body: `${personName} ${readableAction} at ${time}`,
        icon: pic,
      });

      Swal.fire({
        title: "Attendance Notification",
        text: `${personName} with ID ${customId} ${readableAction} at ${time}`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        heightAuto: false,
      });
    },
    [showNotification],
  );

  useEffect(() => {
    if (!lastAttendanceEvent) return;
    if (lastAttendanceEvent.source === "sse") return;
    showAttendanceNotification(lastAttendanceEvent);
  }, [lastAttendanceEvent, showAttendanceNotification]);

  const handleSseAttendanceMessage = useCallback(
    (incoming) => {
      if (!incoming || typeof incoming !== "object") return;
      if (incoming.type && incoming.type !== "clock") return;

      const rawPayload =
        incoming.data && typeof incoming.data === "object"
          ? incoming.data
          : incoming;

      const payload = Array.isArray(rawPayload) ? rawPayload[0] : rawPayload;

      if (!payload || typeof payload !== "object") return;
      const personName =
        payload.personName || payload.name || payload.employee_name;
      const customId =
        payload.customId ||
        payload.user_id ||
        payload.employee_id ||
        payload.id;
      const time =
        payload.time ||
        payload.log_time ||
        payload.LogTime ||
        payload.datetime ||
        payload.timestamp ||
        incoming.timestamp;

      if (!personName || !time) return;

      showAttendanceNotification({
        personName,
        customId: customId || "--",
        time,
        pic: payload.pic || payload.photo || payload.avatar || incoming.avatar,
        punctuality: payload.punctuality || "On Time",
        actionText: incoming.message,
      });
    },
    [showAttendanceNotification],
  );

  useSse({
    clientId: user?.company_id,
    onMessage: handleSseAttendanceMessage,
    storeMessages: false,
    enabled: !!user?.company_id,
  });

  return null;
}
