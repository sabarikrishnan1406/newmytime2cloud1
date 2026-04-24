import ProfilePicture from "@/components/ProfilePicture";
import { Contact, Edit3, Fingerprint, Hash, Monitor, RefreshCw, ScanFace, Smartphone, MapPin, XIcon } from "lucide-react";
import { useState } from "react";

// 1. Define the base icon mapping
const baseIcons = {
  Card: <Contact size={16} title="Card" />,
  Fing: <Fingerprint size={16} title="Fingerprint" />,
  Face: <ScanFace size={16} title="Face" />,
  Pin: <Hash size={16} title="PIN" />,
  Manual: <Edit3 size={16} title="Manual" />,
  Repeated: <RefreshCw size={16} title="Repeated" />,
  Mobile: <Smartphone size={16} title="Mobile" />,
  Device: <Monitor size={16} title="Monitor" />,
};

// 2. Define how each mode maps to those icons
const iconGroups = {
  Card: [baseIcons.Card],
  Fing: [baseIcons.Fing],
  Face: [baseIcons.Face],
  "Fing + Card": [baseIcons.Fing, baseIcons.Card],
  "Face + Fing": [baseIcons.Face, baseIcons.Fing],
  "Face + Card": [baseIcons.Face, baseIcons.Card],
  "Card + Pin": [baseIcons.Card, baseIcons.Pin],
  "Face + Pin": [baseIcons.Face, baseIcons.Pin],
  "Fing + Pin": [baseIcons.Fing, baseIcons.Pin],
  "Fing + Card + Pin": [baseIcons.Fing, baseIcons.Card, baseIcons.Pin],
  "Face + Card + Pin": [baseIcons.Face, baseIcons.Card, baseIcons.Pin],
  "Face + Fing + Pin": [baseIcons.Face, baseIcons.Fing, baseIcons.Pin],
  "Face + Fing + Card": [baseIcons.Face, baseIcons.Fing, baseIcons.Card],
  Manual: [baseIcons.Manual],
  Repeated: [baseIcons.Repeated],
};

export default [
  {
    key: "employee",
    header: "Personnel",
    render: ({ employee }) => (
      <div className="flex items-center space-x-3">

        <ProfilePicture src={employee.profile_picture} />

        <div>
          <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{employee?.first_name}</p>
          <p className="text-sm text-gray-500">
            ID: {employee.employee_id}
          </p>
        </div>
      </div>
    ),
  },

  {
    key: "branch",
    header: "Branch / Department",
    render: ({ employee }) => (
      <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{employee?.branch?.branch_name || "N/A"} / {employee?.department?.name || "N/A"}</p>
    ),
  },
  {
    key: "datetime",
    header: "Date Time",
    render: (log) => (
      <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{log?.date} {log?.time} </p>
    ),
  },
  {
    key: "log_type",
    header: "Log Type",
    render: (log) => (
      <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{log?.log_type}</p>
    ),
  },
  {
    key: "Mode",
    header: "mode",
    render: (e) => {
      // Mode logic
      let modes = [];
      if (e.DeviceID?.includes("Mobile")) {
        modes = [baseIcons.Mobile];
      } else if (iconGroups[e.mode]) {
        modes = iconGroups[e.mode];
      } else {
        modes = [baseIcons.Device];
      }
      return (
        <div className="col-span-1 flex items-center text-slate-600 dark:text-slate-300">
          {modes?.map((icon, idx) => (
            <span key={idx}>{icon}</span>
          ))}
        </div>
      )
    }
  },
  {
    key: "device",
    header: "Device",
    render: (log) => (
      <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{log?.device?.name || "—"}</p>
    ),
  },

  {
    key: "device_type",
    header: "Device Type",
    render: (log) => {
      const deviceType = log?.device?.device_type || "—";
      const typeLabel = deviceType === "all" ? "All" : deviceType === "Attendance" ? "Attendance" : deviceType === "Access Control" ? "Access Control" : deviceType;
      return (
        <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{typeLabel}</p>
      );
    },
  },

  {
    key: "function",
    header: "Function",
    render: (log) => {
      const functionValue = log?.device?.function || "—";
      const functionLabel = functionValue === "auto" ? "Auto" : functionValue === "In" ? "In" : functionValue === "Out" ? "Out" : functionValue;
      return (
        <p className="font-medium text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">{functionLabel}</p>
      );
    },
  },

  {
    key: "location",
    header: "Location",
    render: (log) => <LocationCell log={log} />,
  },
];

function LocationCell({ log }) {
  const [showMap, setShowMap] = useState(false);
  const deviceName = log?.device?.name;
  const isMobile =
    log?.DeviceID?.includes?.("Mobile") ||
    (typeof deviceName === "string" && deviceName.toLowerCase() === "mobile") ||
    (log?.lat && log?.lon);
  const locationName = isMobile
    ? (log?.gps_location || "—")
    : (log?.device?.location || deviceName || "—");

  if (!isMobile) {
    return (
      <span title={locationName} className="font-medium text-sm text-slate-600 dark:text-slate-300 max-w-[220px] truncate inline-block align-middle">
        {locationName}
      </span>
    );
  }

  return (
    <div className="font-medium text-sm text-slate-600 dark:text-slate-300 flex flex-col items-start leading-tight">
      <span
        className="block cursor-pointer hover:text-blue-500"
        title="View on map"
        onClick={e => {
          e.stopPropagation();
          setShowMap(true);
        }}
      >
        <MapPin size={16} />
      </span>
      <span title={locationName} className="max-w-[220px] truncate">{locationName}</span>
      {showMap && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 9999 }}
          onClick={() => setShowMap(false)}
        >
          <div
            className=" bg-white/5 dark:bg-slate-900 p-3"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: 8, minWidth: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`
              .rotate-cw-hover {
                transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
              }
              .rotate-cw-hover:hover {
                transform: rotate(360deg);
              }
            `}</style>
            <div className="flex justify-end items-center mb-4 text-gray-600 dark:text-gray-300">
              <XIcon className="bg-primary rounded-full p-1 -mt-9 -mr-7 cursor-pointer rotate-cw-hover" size={24} onClick={() => setShowMap(false)} />
            </div>
            {(() => {
              const hasCoords = log?.lat && log?.lon;
              const query = hasCoords
                ? `${log.lat},${log.lon}`
                : encodeURIComponent(locationName);
              return (
                <>
                  <div style={{ position: 'relative', width: 600, height: 600 }}>
                    <iframe
                      title="Map"
                      width="600"
                      height="600"
                      style={{ border: 0, display: 'block' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                      }}
                    >
                      <svg width="32" height="40" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#dc2626" />
                        <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 px-3 py-2 bg-white/90 dark:bg-slate-800 rounded text-sm text-slate-700 dark:text-slate-200 w-[600px]">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" title={locationName}>{locationName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {hasCoords ? `${log.lat}, ${log.lon}` : "Coordinates unavailable"}
                          {log?.date && log?.time ? <span className="ml-2">• {log.date} {log.time}</span> : null}
                        </p>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${query}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
