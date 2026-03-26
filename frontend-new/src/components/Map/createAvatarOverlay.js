export function createAvatarOverlay({ maps, employee, pos, map, openPanel, bwMode, moving }) {
  class AvatarOverlay extends maps.OverlayView {
    constructor() {
      super();
      this.employee = employee;
      this.position = pos;
      this.div = null;
    }
    onAdd() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.style.transform = "translate(-50%,-50%)";
      this.div.style.pointerEvents = "auto";

      const size = 48;
      const border = 4;

      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;

      const ping = document.createElement("div");
      ping.className = "avatar-ping";
      ping.style.position = "absolute";
      ping.style.left = `-${border}px`;
      ping.style.top = `-${border}px`;
      ping.style.width = `${size + border * 2}px`;
      ping.style.height = `${size + border * 2}px`;
      ping.style.borderRadius = "50%";
      ping.style.pointerEvents = "none";

      const avatarWrap = document.createElement("div");
      avatarWrap.style.width = `${size}px`;
      avatarWrap.style.height = `${size}px`;
      avatarWrap.style.borderRadius = "50%";
      avatarWrap.style.overflow = "hidden";
      avatarWrap.style.boxSizing = "border-box";
      avatarWrap.style.border = "4px solid #1152d4";
      avatarWrap.style.boxShadow = "0 6px 18px rgba(2,6,23,0.6)";
      avatarWrap.className = "avatar-wrap";

      const img = document.createElement("img");
      img.src = this.employee.avatar || "";
      img.alt = this.employee.name || "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.draggable = false;

      avatarWrap.appendChild(img);
      container.appendChild(ping);
      container.appendChild(avatarWrap);

      const tooltip = document.createElement("div");
      tooltip.className = "pin-tooltip";
      tooltip.style.position = "absolute";
      tooltip.style.bottom = "100%";
      tooltip.style.left = "50%";
      tooltip.style.transform = "translate(-50%,8px)";
      tooltip.style.pointerEvents = "none";
      tooltip.style.opacity = "0";
      tooltip.style.transition = "opacity 0.10s, transform 0.18s";

        // Start ping animation for 5 seconds
        ping.style.background = "rgba(17,82,212,0.4)";
        ping.style.animation = "ping 1s cubic-bezier(0,0,0.2,1) infinite";
        setTimeout(() => {
          ping.style.animation = "";
          ping.style.background = "transparent";
        }, 5000);
      const glass = document.createElement("div");
      glass.className = "glass-panel rounded-xl p-3 w-48 shadow-2xl";
      glass.style.width = "12rem";
      glass.style.fontSize = "12px";

      const titleRow = document.createElement("div");
      titleRow.className = "flex items-start justify-between mb-2";
      const titleBlk = document.createElement("div");
      const h4 = document.createElement("h4");
      h4.className = "text-xs font-bold text-white";
      h4.textContent = this.employee.name || "";
      const p = document.createElement("p");
      p.className = "text-[10px] text-slate-400";
      p.textContent = this.employee.location || "";
      titleBlk.appendChild(h4);
      titleBlk.appendChild(p);
      titleRow.appendChild(titleBlk);

      const ico = document.createElement("svg");
      ico.setAttribute("viewBox", "0 0 24 24");
      ico.setAttribute("fill", "currentColor");
      ico.className = "w-4 h-4 text-green-400 flex-shrink-0";
      ico.innerHTML = '<path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 3h-2v-2h2v2zm0-4h-2V7h2v4z"/>';
      titleRow.appendChild(ico);

      // show single avatar preview in tooltip (no separate ref/live images)
      const previewWrap = document.createElement("div");
      previewWrap.className = "mb-2 rounded-lg overflow-hidden bg-slate-700";
      previewWrap.style.height = "8rem";
      previewWrap.style.width = "100%";
      const previewImg = document.createElement("img");
      previewImg.src = this.employee.avatar || "";
      previewImg.alt = this.employee.name || "";
      previewImg.style.width = "100%";
      previewImg.style.height = "100%";
      previewImg.style.objectFit = "cover";
      previewWrap.appendChild(previewImg);

      glass.appendChild(titleRow);
      glass.appendChild(previewWrap);

      tooltip.appendChild(glass);

      this.div.appendChild(container);
      this.div.appendChild(tooltip);

      this.tooltipEl = tooltip;
      this.pingEl = ping;
      this.avatarWrap = avatarWrap;

      this.div.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
          openPanel(this.employee);
        } catch (err) {}
      });

      this.div.addEventListener("mouseenter", () => {
        if (this.tooltipEl) {
          this.tooltipEl.style.opacity = "1";
          this.tooltipEl.style.transform = "translate(-50%,0)";
          this.tooltipEl.style.pointerEvents = "auto";
        }
      });
      this.div.addEventListener("mouseleave", () => {
        if (this.tooltipEl) {
          this.tooltipEl.style.opacity = "0";
          this.tooltipEl.style.transform = "translate(-50%,8px)";
          this.tooltipEl.style.pointerEvents = "none";
        }
      });

      this.getPanes().overlayMouseTarget.appendChild(this.div);
    }
    draw() {
      if (!this.div) return;
      const projection = this.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(
        new maps.LatLng(this.position.lat, this.position.lng),
      );
      if (point) {
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }
    onRemove() {
      if (this.div && this.div.parentNode) this.div.parentNode.removeChild(this.div);
      this.div = null;
      this.pingEl = null;
      this.avatarWrap = null;
    }
    setPosition(p) {
      this.position = p;
      try {
        this.draw();
      } catch (e) {}
    }
    setMoving(flag) {
      if (!this.pingEl || !this.avatarWrap) return;
      if (flag) {
        this.pingEl.style.background = "rgba(17,82,212,0.4)";
        this.pingEl.style.animation = "ping 1.5s cubic-bezier(0,0,0.2,1) infinite";
        this.avatarWrap.style.borderColor = "#1fb5ff";
      } else {
        this.pingEl.style.animation = "";
        this.pingEl.style.background = "transparent";
        this.avatarWrap.style.borderColor = "#1152d4";
      }
    }
    setBW(flag) {
      // Do nothing: avatars should always remain colorful, bwMode only affects map background
    }
  }

  const overlay = new AvatarOverlay();
  overlay.setMap(map);
  overlay.setMoving(Boolean(moving));
  overlay.setBW(Boolean(bwMode));
  return overlay;
}