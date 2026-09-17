(function () {
  const hTimeline = document.getElementById("h-timeline");
  const hMedia = document.getElementById("h-media");
  const tooltip = document.getElementById("tooltip");
  const tooltipTitle = document.getElementById("tooltip-title");
  const tooltipInstitution = document.getElementById("tooltip-institution");
  const tooltipDate = document.getElementById("tooltip-date");
  const tooltipDesc = document.getElementById("tooltip-desc");
  const tooltipLink = document.getElementById("tooltip-link");
  const headerRole = document.getElementById("header-role");
  const contactText = document.getElementById("contact-text");
  const contactLink = document.getElementById("contact-link");
  const langToggle = document.getElementById("lang-toggle");
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  const lightboxClose = document.getElementById("lightbox-close");

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

  function getYouTubeId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function generateVideoThumbnail(url, onReady) {
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 4);
    });
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        onReady(canvas.toDataURL("image/jpeg", 0.75));
      } catch (e) {
      }
    }, { once: true });
  }

  let galleryImages = [];
  let galleryIndex = 0;

  function showGalleryIndex(index) {
    const total = galleryImages.length;
    galleryIndex = (index + total) % total;
    const img = lightboxContent.querySelector(".lightbox__carousel-img");
    if (img) img.src = galleryImages[galleryIndex];
    lightboxContent.querySelectorAll(".lightbox__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === galleryIndex);
    });
  }

  function openLightbox(item) {
    lightboxContent.innerHTML = "";
    const ytId = item.video ? getYouTubeId(item.video) : null;
    galleryImages = [];
    galleryIndex = 0;

    if (ytId) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      iframe.loading = "lazy";
      lightboxContent.appendChild(iframe);
    } else if (item.video) {
      const video = document.createElement("video");
      video.className = "lightbox__video";
      video.src = item.video;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      lightboxContent.appendChild(video);
    } else if (item.images && item.images.length) {
      galleryImages = item.images;

      const carousel = document.createElement("div");
      carousel.className = "lightbox__carousel";

      const img = document.createElement("img");
      img.className = "lightbox__carousel-img";
      img.src = galleryImages[0];
      img.alt = item.title;

      if (galleryImages.length > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "lightbox__nav lightbox__nav--prev";
        prevBtn.setAttribute("aria-label", "Previous image");
        prevBtn.textContent = "‹";
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          showGalleryIndex(galleryIndex - 1);
        });
        carousel.appendChild(prevBtn);
      }

      carousel.appendChild(img);

      if (galleryImages.length > 1) {
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "lightbox__nav lightbox__nav--next";
        nextBtn.setAttribute("aria-label", "Next image");
        nextBtn.textContent = "›";
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          showGalleryIndex(galleryIndex + 1);
        });
        carousel.appendChild(nextBtn);
      }

      lightboxContent.appendChild(carousel);

      if (galleryImages.length > 1) {
        const dots = document.createElement("div");
        dots.className = "lightbox__dots";
        galleryImages.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "lightbox__dot" + (i === 0 ? " is-active" : "");
          dot.setAttribute("aria-label", `Image ${i + 1}`);
          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            showGalleryIndex(i);
          });
          dots.appendChild(dot);
        });
        lightboxContent.appendChild(dots);
      }
    }

    if (item.description) {
      const desc = document.createElement("p");
      desc.className = "lightbox__description";
      desc.textContent = item.description;
      lightboxContent.appendChild(desc);
    }

    lightbox.classList.add("is-visible");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    lightboxContent.innerHTML = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-visible")) return;
    if (e.key === "Escape") closeLightbox();
    if (galleryImages.length > 1) {
      if (e.key === "ArrowLeft") showGalleryIndex(galleryIndex - 1);
      if (e.key === "ArrowRight") showGalleryIndex(galleryIndex + 1);
    }
  });

  function createMediaSquare(container, item) {
    const square = document.createElement("button");
    square.type = "button";
    square.className = item.video ? "h-media__item h-media__item--video" : "h-media__item";
    square.setAttribute("aria-label", item.title);

    if (item.images && item.images.length) {
      square.style.backgroundImage = `url("${item.images[0]}")`;
    } else if (item.video) {
      const ytId = getYouTubeId(item.video);
      if (ytId) {
        square.style.backgroundImage = `url("https://img.youtube.com/vi/${ytId}/mqdefault.jpg")`;
      } else {
        generateVideoThumbnail(item.video, (dataUrl) => {
          square.style.backgroundImage = `url("${dataUrl}")`;
        });
      }
    }

    square.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(item);
    });

    container.appendChild(square);
    return square;
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
            dateLabel: formatDate(project.startDate || project.date),
            description: text.description,
            url: project.url,
            images: project.images || [],
            video: project.video || null
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
          item: {
            title: text.title,
            description: text.description,
            url: collab.url,
            images: collab.images || [],
            video: collab.video || null
          }
        };
      });

    return projectItems.concat(educationItems, collaborationItems);
  }

  function durationEntries() {
    const projectEntries = PROJECTS.map((p) => ({
      start: parseDate(p.startDate || p.date),
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

  function buildHorizontal() {
    hTimeline.querySelectorAll(
      ".h-tick, .h-year-label, .timeline__dot, .h-duration-connector, .h-duration-bar, .h-duration-cap, .h-now-label"
    ).forEach((el) => el.remove());
    hMedia.innerHTML = "";

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

      if ((item.images && item.images.length) || item.video) {
        const square = createMediaSquare(hMedia, item);
        square.style.left = `${xFor(fraction)}px`;
        dot.addEventListener("mouseenter", () => square.classList.add("is-linked"));
        dot.addEventListener("mouseleave", () => square.classList.remove("is-linked"));
        square.addEventListener("mouseenter", () => {
          if (!pinned) showTooltip(item, dot);
        });
        square.addEventListener("mouseleave", () => {
          if (!pinned) hideTooltip();
        });
      }
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
      buildHorizontal();
    }, 150);
  });

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    headerRole.textContent = UI_TEXT[currentLang].role;
    contactText.textContent = UI_TEXT[currentLang].contact;
    contactLink.textContent = UI_TEXT[currentLang].contactCta;
    contactLink.href = CONTACT_URL;
    langToggle.textContent = currentLang === "es" ? "EN" : "ES";
    langToggle.setAttribute(
      "aria-label",
      currentLang === "es" ? "Switch to English" : "Cambiar a español"
    );

    hideTooltip();
    buildHorizontal();
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
})();
