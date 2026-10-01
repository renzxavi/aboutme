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
    if (img) {
      img.classList.add("is-loading");
      img.onload = () => img.classList.remove("is-loading");
      img.src = galleryImages[galleryIndex];
    }
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

    hideTooltip();
    lightbox.classList.add("is-visible");
    document.body.classList.add("has-lightbox");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    document.body.classList.remove("has-lightbox");
    lightboxContent.innerHTML = "";
  }

  // Swipe horizontal para cambiar de imagen en pantallas táctiles.
  let touchStartX = null;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchStartX === null || galleryImages.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 40) showGalleryIndex(galleryIndex + (dx < 0 ? 1 : -1));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxContent || e.target.classList.contains("lightbox__carousel")) {
      closeLightbox();
    }
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

  // Separa posiciones que quedan a menos de `gap` entre sí: agrupa las que
  // chocan y las reparte centradas en su promedio, sin salir de [min, max].
  // Devuelve las nuevas posiciones en el mismo orden que `xs`.
  function spread(xs, gap, min, max) {
    const order = xs.map((_, i) => i).sort((a, b) => xs[a] - xs[b]);
    const clusters = order.map((i) => ({ ids: [i], sum: xs[i] }));

    function place(c) {
      const half = ((c.ids.length - 1) * gap) / 2;
      const center = Math.min(Math.max(c.sum / c.ids.length, min + half), max - half);
      c.left = center - half;
      c.right = center + half;
    }

    clusters.forEach(place);
    for (let i = 0; i < clusters.length - 1; ) {
      const a = clusters[i];
      const b = clusters[i + 1];
      if (b.left - a.right < gap) {
        a.ids = a.ids.concat(b.ids);
        a.sum += b.sum;
        place(a);
        clusters.splice(i + 1, 1);
        i = Math.max(0, i - 1);
      } else {
        i++;
      }
    }

    const out = new Array(xs.length);
    clusters.forEach((c) => c.ids.forEach((id, k) => { out[id] = c.left + k * gap; }));
    return out;
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

    const entries = durationEntries();
    const LANE_STEP = Math.min(11, (hTimeline.clientHeight / 2 - 8) / Math.max(1, entries.length));
    entries
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

    const items = dotItems();
    const DOT_GAP = 18;
    const dotXs = spread(items.map(({ fraction }) => xFor(fraction)), DOT_GAP, padding, width - padding);

    const mediaEntries = [];
    items.forEach(({ extraClass, item }, i) => {
      const dot = createDot(hTimeline, extraClass, item);
      dot.style.top = "50%";
      dot.style.left = `${dotXs[i]}px`;

      if ((item.images && item.images.length) || item.video) {
        mediaEntries.push({ item, dot, dotX: dotXs[i] });
      }
    });

    layoutMedia(mediaEntries);
  }

  // Ubica las miniaturas debajo de la línea sin que se superpongan y las une
  // a su punto con una línea (las miniaturas pueden quedar corridas del punto).
  function layoutMedia(entries) {
    if (!entries.length) return;

    const MEDIA_GAP = 16;
    const MAX_SIZE = window.innerWidth <= 520 ? 108 : 140;
    const LINK_HEIGHT = parseFloat(getComputedStyle(hMedia).marginTop) || 36;
    const mediaWidth = hMedia.clientWidth;
    const size = Math.min(MAX_SIZE, (mediaWidth - MEDIA_GAP * (entries.length - 1)) / entries.length);
    const squareXs = spread(entries.map((e) => e.dotX), size + MEDIA_GAP, size / 2, mediaWidth - size / 2);

    hMedia.style.height = `${size}px`;

    const svgNS = "http://www.w3.org/2000/svg";
    const links = document.createElementNS(svgNS, "svg");
    links.setAttribute("class", "h-media__links");
    links.style.top = `${-LINK_HEIGHT}px`;
    links.style.height = `${LINK_HEIGHT}px`;
    hMedia.appendChild(links);

    entries.forEach(({ item, dot, dotX }, i) => {
      const square = createMediaSquare(hMedia, item);
      square.style.left = `${squareXs[i]}px`;
      square.style.width = `${size}px`;
      square.style.height = `${size}px`;

      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", dotX);
      line.setAttribute("y1", 4);
      line.setAttribute("x2", squareXs[i]);
      line.setAttribute("y2", LINK_HEIGHT);
      links.appendChild(line);

      const link = () => {
        square.classList.add("is-linked");
        line.classList.add("is-linked");
      };
      const unlink = () => {
        square.classList.remove("is-linked");
        line.classList.remove("is-linked");
      };
      dot.addEventListener("mouseenter", link);
      dot.addEventListener("mouseleave", unlink);
      square.addEventListener("mouseenter", () => {
        link();
        if (!pinned) showTooltip(item, dot);
      });
      square.addEventListener("mouseleave", () => {
        unlink();
        if (!pinned) hideTooltip();
      });
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
