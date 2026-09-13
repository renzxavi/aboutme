(function () {
  const introStage = document.getElementById("intro-stage");
  const hTimeline = document.getElementById("h-timeline");
  const timeline = document.getElementById("timeline");
  const lineEl = document.getElementById("timeline-line");
  const tooltip = document.getElementById("tooltip");
  const tooltipTitle = document.getElementById("tooltip-title");
  const tooltipInstitution = document.getElementById("tooltip-institution");
  const tooltipDate = document.getElementById("tooltip-date");
  const tooltipDesc = document.getElementById("tooltip-desc");
  const tooltipLink = document.getElementById("tooltip-link");
  const headerRole = document.getElementById("header-role");
  const scrollHint = document.getElementById("scroll-hint");
  const langToggle = document.getElementById("lang-toggle");
  const viewToggle = document.getElementById("view-toggle");

  const TOP_PADDING = 60;
  const BOTTOM_PADDING = 60;

  let currentLang = "en";
  try {
    currentLang = localStorage.getItem("lang") || "en";
  } catch (e) {
    currentLang = "en";
  }

  function pick(entry) {
    return entry[currentLang] || entry.es;
  }

  function parseDate(str) {
    const [year, month] = str.split("-").map(Number);
    return year + (month - 1) / 12;
  }

  function formatDate(str) {
    const [year, month] = str.split("-").map(Number);
    return `${UI_TEXT[currentLang].months[month - 1]}. ${year}`;
  }

  function pxPerYear() {
    return window.innerWidth <= 520 ? 200 : 260;
  }

  // EDUCATION admite año simple (2021) o "AAAA-MM" (2021-11) para
  // precisión de mes. Estas funciones soportan ambos formatos.
  function toFraction(value) {
    return typeof value === "string" ? parseDate(value) : value;
  }

  function formatEduDate(value) {
    return typeof value === "string" ? formatDate(value) : String(value);
  }

  function eduStart(edu) {
    return edu.startDate || edu.date || edu.startYear || edu.year;
  }

  function eduEnd(edu) {
    return edu.endDate || edu.endYear || null;
  }

  function eduIsRange(edu) {
    return Boolean(edu.startDate || edu.startYear);
  }

  let activeDot = null;
  let pinned = false;

  function hideTooltip() {
    pinned = false;
    tooltip.classList.remove("is-visible");
    if (activeDot) {
      activeDot.classList.remove("is-active");
      activeDot = null;
    }
  }

  function displayUrl(url) {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  function showTooltip(item, dotEl) {
    tooltipTitle.textContent = item.title;
    tooltipInstitution.textContent = item.institution || "";
    tooltipInstitution.hidden = !item.institution;
    tooltipDate.textContent = item.dateLabel || "";
    tooltipDate.hidden = !item.dateLabel;
    tooltipDesc.textContent = item.description || "";
    tooltipDesc.hidden = !item.description;
    if (item.url) {
      tooltipLink.href = item.url;
      tooltipLink.textContent = displayUrl(item.url);
      tooltipLink.hidden = false;
    } else {
      tooltipLink.hidden = true;
    }

    tooltip.classList.add("is-visible");
    if (activeDot) activeDot.classList.remove("is-active");
    activeDot = dotEl;
    activeDot.classList.add("is-active");

    const dotRect = dotEl.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const margin = 16;

    let left = dotRect.left - tooltipWidth - margin;
    if (left < margin) {
      left = dotRect.right + margin;
    }
    if (left + tooltipWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - tooltipWidth - margin);
    }

    let top = dotRect.top + dotRect.height / 2 - tooltipHeight / 2;
    top = Math.min(Math.max(top, margin), window.innerHeight - tooltipHeight - margin);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function timelineRange() {
    const now = new Date();
    const nowYearFraction = now.getFullYear() + now.getMonth() / 12;
    const allFractions = [
      START_YEAR,
      ...PROJECTS.map((p) => parseDate(p.date)),
      ...EDUCATION.map((e) => toFraction(eduStart(e))),
      ...EDUCATION.filter((e) => eduEnd(e)).map((e) => toFraction(eduEnd(e))),
      ...COLLABORATIONS.map((c) => parseDate(c.date))
    ];
    return {
      nowYearFraction,
      startFraction: Math.min(...allFractions),
      endFraction: Math.max(nowYearFraction, ...allFractions) + 0.5
    };
  }

  function createDot(container, extraClass, item) {
    const dot = document.createElement("div");
    dot.className = extraClass ? `timeline__dot ${extraClass}` : "timeline__dot";
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", item.title);

    dot.addEventListener("mouseenter", () => {
      if (!pinned) showTooltip(item, dot);
    });
    dot.addEventListener("mouseleave", () => {
      if (!pinned) hideTooltip();
    });
    dot.addEventListener("focus", () => {
      if (!pinned) showTooltip(item, dot);
    });
    dot.addEventListener("blur", () => {
      if (!pinned) hideTooltip();
    });
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pinned && activeDot === dot) {
        hideTooltip();
      } else {
        pinned = true;
        showTooltip(item, dot);
      }
    });

    container.appendChild(dot);
    return dot;
  }

  function dotItems() {
    const projectItems = PROJECTS
      .slice()
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))
      .map((project) => {
        const text = pick(project);
        return {
          fraction: parseDate(project.date),
          extraClass: null,
          item: {
            title: text.title,
            institution: project.institution,
            dateLabel: formatDate(project.date),
            description: text.description,
            url: project.url
          }
        };
      });

    const educationItems = EDUCATION
      .slice()
      .sort((a, b) => toFraction(eduStart(a)) - toFraction(eduStart(b)))
      .map((edu) => {
        const text = pick(edu);
        const end = eduEnd(edu);
        const dateLabel = eduIsRange(edu)
          ? `${formatEduDate(eduStart(edu))}–${end ? formatEduDate(end) : UI_TEXT[currentLang].now}`
          : formatEduDate(eduStart(edu));
        return {
          fraction: toFraction(eduStart(edu)),
          extraClass: "timeline__dot--education",
          item: { title: text.title, institution: edu.institution, dateLabel }
        };
      });

    const collaborationItems = COLLABORATIONS
      .slice()
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))
      .map((collab) => {
        const text = pick(collab);
        return {
          fraction: parseDate(collab.date),
          extraClass: "timeline__dot--collab",
          item: { title: text.title, description: text.description, url: collab.url }
        };
      });

    return projectItems.concat(educationItems, collaborationItems);
  }

  function durationEntries() {
    const projectEntries = PROJECTS.map((p) => ({
      start: parseDate(p.date),
      end: p.endDate ? parseDate(p.endDate) : null,
      isEducation: false
    }));

    const eduEntries = EDUCATION
      .filter((e) => eduIsRange(e))
      .map((e) => ({
        start: toFraction(eduStart(e)),
        end: eduEnd(e) ? toFraction(eduEnd(e)) : null,
        isEducation: true
      }));

    return projectEntries.concat(eduEntries).sort((a, b) => a.start - b.start);
  }

  function build() {
    timeline.querySelectorAll(
      ".timeline__tick, .timeline__year-label, .timeline__dot, .timeline__now-label, .timeline__duration-connector, .timeline__duration-bar, .timeline__duration-cap"
    ).forEach((el) => el.remove());

    const { nowYearFraction, startFraction, endFraction } = timelineRange();
    const ppy = pxPerYear();

    const totalHeight = (endFraction - startFraction) * ppy + TOP_PADDING + BOTTOM_PADDING;
    timeline.style.height = `${totalHeight}px`;
    lineEl.style.top = `${TOP_PADDING}px`;
    lineEl.style.height = `${totalHeight - TOP_PADDING - BOTTOM_PADDING}px`;

    function yFor(fraction) {
      return TOP_PADDING + (fraction - startFraction) * ppy;
    }

    const startYear = Math.floor(startFraction);
    const endYear = Math.floor(endFraction);
    for (let year = startYear; year <= endYear; year++) {
      const y = yFor(year);

      const tick = document.createElement("div");
      tick.className = "timeline__tick";
      tick.style.top = `${y}px`;
      timeline.appendChild(tick);

      const label = document.createElement("div");
      label.className = "timeline__year-label";
      label.style.top = `${y}px`;
      label.textContent = year;
      timeline.appendChild(label);
    }

    const nowLabel = document.createElement("div");
    nowLabel.className = "timeline__now-label";
    nowLabel.style.top = `${yFor(nowYearFraction)}px`;
    nowLabel.textContent = UI_TEXT[currentLang].now;
    timeline.appendChild(nowLabel);

    const LANE_STEP = 16;
    durationEntries()
      .forEach((entry, index) => {
        const startY = yFor(entry.start);
        const endFractionForBar = entry.end !== null ? entry.end : nowYearFraction;
        const endY = yFor(endFractionForBar);
        if (endY <= startY) return;

        const offset = LANE_STEP * (index + 1);
        const modifier = entry.isEducation ? " timeline__duration-connector--education" : "";
        const modifierBar = entry.isEducation ? " timeline__duration-bar--education" : "";
        const modifierCap = entry.isEducation ? " timeline__duration-cap--education" : "";

        const connector = document.createElement("div");
        connector.className = "timeline__duration-connector" + modifier;
        connector.style.top = `${startY}px`;
        connector.style.left = `calc(50% - ${offset}px)`;
        connector.style.width = `${offset}px`;
        timeline.appendChild(connector);

        const bar = document.createElement("div");
        bar.className = "timeline__duration-bar" + modifierBar;
        bar.style.left = `calc(50% - ${offset}px)`;
        bar.style.top = `${startY}px`;
        bar.style.height = `${endY - startY}px`;
        timeline.appendChild(bar);

        const cap = document.createElement("div");
        cap.className = "timeline__duration-cap" + modifierCap;
        cap.style.left = `calc(50% - ${offset}px)`;
        cap.style.top = `${endY}px`;
        timeline.appendChild(cap);
      });

    dotItems().forEach(({ fraction, extraClass, item }) => {
      const dot = createDot(timeline, extraClass, item);
      dot.style.top = `${yFor(fraction)}px`;
    });
  }

  function buildHorizontal() {
    hTimeline.querySelectorAll(
      ".h-tick, .h-year-label, .timeline__dot, .h-duration-connector, .h-duration-bar, .h-duration-cap, .h-now-label"
    ).forEach((el) => el.remove());

    const { nowYearFraction, startFraction, endFraction } = timelineRange();
    const padding = 18;
    const width = hTimeline.clientWidth;
    const usable = Math.max(1, width - padding * 2);

    function xFor(fraction) {
      return padding + ((fraction - startFraction) / (endFraction - startFraction)) * usable;
    }

    const startYear = Math.floor(startFraction);
    const endYear = Math.floor(endFraction);
    for (let year = startYear; year <= endYear; year++) {
      const x = xFor(year);

      const tick = document.createElement("div");
      tick.className = "h-tick";
      tick.style.left = `${x}px`;
      hTimeline.appendChild(tick);

      const label = document.createElement("div");
      label.className = "h-year-label";
      label.style.left = `${x}px`;
      label.textContent = year;
      hTimeline.appendChild(label);
    }

    const nowLabel = document.createElement("div");
    nowLabel.className = "h-now-label";
    nowLabel.style.left = `${xFor(nowYearFraction)}px`;
    nowLabel.textContent = UI_TEXT[currentLang].now;
    hTimeline.appendChild(nowLabel);

    const LANE_STEP = 11;
    durationEntries()
      .forEach((entry, index) => {
        const startX = xFor(entry.start);
        const endFractionForBar = entry.end !== null ? entry.end : nowYearFraction;
        const endX = xFor(endFractionForBar);
        if (endX <= startX) return;

        const offset = LANE_STEP * (index + 1);
        const modifier = entry.isEducation ? " h-duration-connector--education" : "";
        const modifierBar = entry.isEducation ? " h-duration-bar--education" : "";
        const modifierCap = entry.isEducation ? " h-duration-cap--education" : "";

        const connector = document.createElement("div");
        connector.className = "h-duration-connector" + modifier;
        connector.style.left = `${startX}px`;
        connector.style.top = `calc(50% - ${offset}px)`;
        connector.style.height = `${offset}px`;
        hTimeline.appendChild(connector);

        const bar = document.createElement("div");
        bar.className = "h-duration-bar" + modifierBar;
        bar.style.top = `calc(50% - ${offset}px)`;
        bar.style.left = `${startX}px`;
        bar.style.width = `${endX - startX}px`;
        hTimeline.appendChild(bar);

        const cap = document.createElement("div");
        cap.className = "h-duration-cap" + modifierCap;
        cap.style.top = `calc(50% - ${offset}px)`;
        cap.style.left = `${endX}px`;
        hTimeline.appendChild(cap);
      });

    dotItems().forEach(({ fraction, extraClass, item }) => {
      const dot = createDot(hTimeline, extraClass, item);
      dot.style.top = "50%";
      dot.style.left = `${xFor(fraction)}px`;
    });
  }

  document.addEventListener("click", (e) => {
    if (!tooltip.contains(e.target) && !e.target.classList.contains("timeline__dot")) {
      hideTooltip();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      hideTooltip();
      build();
      if (!expanded) buildHorizontal();
    }, 150);
  });


  let expanded = false;
  let expandTimer = null;

  function expand() {
    if (expanded) return;
    expanded = true;

    introStage.classList.add("is-leaving");
    timeline.classList.add("is-visible");

    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeydown);

    expandTimer = setTimeout(() => {
      introStage.classList.add("is-static");
      hTimeline.style.display = "none";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      viewToggle.hidden = false;
    }, 480);
  }

  function collapse() {
    if (!expanded) return;
    expanded = false;
    clearTimeout(expandTimer);
    hideTooltip();

    viewToggle.hidden = true;
    introStage.classList.remove("is-static", "is-leaving");
    timeline.classList.remove("is-visible");
    hTimeline.style.display = "";
    buildHorizontal();

    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeydown);
  }

  viewToggle.addEventListener("click", collapse);

  function onWheel(e) {
    e.preventDefault();
    expand();
  }

  let touchStartY = null;
  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    if (Math.abs(touchStartY - currentY) > 12) {
      e.preventDefault();
      expand();
    }
  }

  function onKeydown(e) {
    if (["ArrowDown", "PageDown", "End", "Enter", " "].includes(e.key)) {
      expand();
    }
  }

  function startIntro() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeydown);
  }


  function applyLanguage() {
    document.documentElement.lang = currentLang;
    headerRole.textContent = UI_TEXT[currentLang].role;
    scrollHint.textContent = UI_TEXT[currentLang].scrollHint;
    langToggle.textContent = currentLang === "es" ? "EN" : "ES";
    langToggle.setAttribute(
      "aria-label",
      currentLang === "es" ? "Switch to English" : "Cambiar a español"
    );

    hideTooltip();
    build();
    if (!expanded) buildHorizontal();
  }

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    try {
      localStorage.setItem("lang", currentLang);
    } catch (e) {
    }
    applyLanguage();
  });

  applyLanguage();
  startIntro();
})();
