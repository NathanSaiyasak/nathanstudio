(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  let escapeNavHandler = function () {};

  if (menuToggle && siteNav) {
    function resetMenu() {
      siteNav.classList.remove("is-open");
      siteNav.classList.remove("is-closing");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }

    function closeMenu() {
      if (!siteNav.classList.contains("is-open")) {
        return;
      }

      siteNav.classList.remove("is-open");
      siteNav.classList.add("is-closing");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }

    function openMenu() {
      siteNav.classList.remove("is-closing");
      siteNav.classList.add("is-open");
      menuToggle.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    }

    menuToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (!siteNav.contains(target) && !menuToggle.contains(target)) {
        closeMenu();
      }
    });

    escapeNavHandler = closeMenu;

    siteNav.addEventListener("transitionend", function (event) {
      if (event.propertyName !== "transform") {
        return;
      }

      if (!siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-closing");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        resetMenu();
      }
    });
  }

  document.querySelectorAll("[data-typing-text]").forEach(function (element) {
    const fullText = element.getAttribute("data-typing-text") || "";
    if (!fullText) {
      return;
    }

    element.style.minWidth = fullText.length + "ch";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      element.textContent = fullText;
      element.classList.add("is-done");
      return;
    }

    const delay = 85;
    const restartDelay = 5000;

    function startTyping() {
      let index = 0;
      element.classList.remove("is-done");
      element.textContent = "";

      function typeNext() {
        index += 1;
        element.textContent = fullText.slice(0, index);
        if (index < fullText.length) {
          setTimeout(typeNext, delay);
        } else {
          element.classList.add("is-done");
          setTimeout(startTyping, restartDelay);
        }
      }

      setTimeout(typeNext, 200);
    }

    startTyping();
  });

  const featuredProjects = [
    {
      title: "Zeragrains",
      description:
        "A brand rooted in heritage, sustainability, and authenticity. This packaging design for Thai Jasmine Rice reflects the elegance of Thai culture while maintaining functionality and clear communication. A harmonious blend of tradition and modern branding.",
      tags: ["Packaging Design", "Brand Identity", "Logo Design", "3D Visualization"],
      images: [
        "assets/img/featured-img/img-1-1.png",
        "assets/img/featured-img/img-1-2.png",
        "assets/img/featured-img/img-1-3.png",
        "assets/img/featured-img/img-1-4.png",
      ],
    },
    {
      title: "CQUARE Website",
      description:
        "'CQUARE' is more than a brand; it's your gateway to effortless fashion. The mission? To bring you closer to your wardrobe dreams with just a click. I believe in the power of choice, the elegance of simplicity, and the accessibility of fashion for everyone. From the minimalistic design of the logo to the seamless experience of the website, every thread we weave is crafted with your convenience in mind.",
      tags: ["Web/App Design", "Logo Design", "Brand Identity"],
      images: [
        "assets/img/featured-img/img-2-1.png",
        "assets/img/featured-img/img-2-2.png",
        "assets/img/featured-img/img-2-3.png",
        "assets/img/featured-img/img-2-4.png",
      ],
    },
    {
      title: "Sailer Branding",
      description: "A coastal-inspired visual identity and social media campaign designed to promote Sailer Resort through a clean, tropical, and travel-focused brand experience.",
      tags: ["Brand Identity", "Logo Design", "Graphic Design"],
      images: ["assets/img/featured-img/img-3-1.png", "assets/img/featured-img/img-3-2.png"],
    },
    {
      title: "LYDUS – Brand & Packaging System",
      description:
        "An end-to-end design system for LYDUS nitrile gloves, spanning branding, packaging, 3D renders, and marketing visuals. Built to communicate clarity, trust, and consistency across both medical and commercial contexts.",
      tags: ["Brand Identity", "Packaging Design", "3D Visualization"],
      images: [
        "assets/img/featured-img/img-4-1.png",
        "assets/img/featured-img/img-4-2.png",
        "assets/img/featured-img/img-4-3.png",
      ],
    },
    {
      title: "Training Campaign",
      description: "A high-impact promotional visual designed to capture attention and drive sign-ups for a professional training event.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-5-1.png"],
    },
    {
      title: "LINE OA Experience",
      description:
        "A modular rich menu system designed to guide users through eco-friendly travel choices with clarity, structure, and intuitive interaction.",
      tags: ["Web/App Design"],
      images: ["assets/img/featured-img/img-6-1.png", "assets/img/featured-img/img-6-2.png"],
    },
    {
      title: "Vacation Bible School Campaign",
      description:
        "An engaging event visual designed to communicate key information clearly while maintaining a playful and energetic tone.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-7-1.png", "assets/img/featured-img/img-7-2.png"],
    },
    {
      title: "Medical Product Brochure",
      description:
        "A structured brochure designed to communicate product reliability, range, and mission-driven impact with clarity and trust.",
      tags: ["Brochure Design"],
      images: ["assets/img/featured-img/img-8-1.png", "assets/img/featured-img/img-8-2.png"],
    },
    {
      title: "Infrastructure Company Brochure",
      description:
        "A corporate brochure designed to present complex service information with clarity while reinforcing a strong and credible brand presence.",
      tags: ["Brochure Design", "Brand Identity"],
      images: ["assets/img/featured-img/img-9-1.png", "assets/img/featured-img/img-9-2.png"],
    },
    {
      title: "VitalNest Branding",
      description: "A premium packaging design for a wellness brand, crafted to communicate quality, calmness, and trust through a nature-inspired visual identity.",
      tags: ["Packaging Design", "Brand Identity", "3D Visualization"],
      images: ["assets/img/featured-img/img-10-1.png", "assets/img/featured-img/img-10-2.png"],
    },
    {
      title: "PLEō Brand Identity",
      description:
        "A cohesive brand system for a microgreens startup, positioning the product as a premium health offering through clean visuals and consistent storytelling.",
      tags: ["Brand Identity", "Logo Design"],
      images: [
        "assets/img/featured-img/img-11-1.png",
        "assets/img/featured-img/img-11-2.png",
        "assets/img/featured-img/img-11-3.png",
        "assets/img/featured-img/img-11-4.png",
        "assets/img/featured-img/img-11-5.png",
      ],
    },
    {
      title: "Believe – Youth Camp Campaign",
      description:
        "A campaign visual designed to inspire emotional connection and clearly communicate the message of a youth camp experience.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-12-1.png", "assets/img/featured-img/img-12-2.png"],
    },
    {
      title: "Training Campaign Poster",
      description: "A promotional poster designed to capture attention and drive attendance for a professional talk and training event.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-13-1.png"],
    },
    {
      title: "Corporate Website",
      description:
        "A corporate website redesign focused on strengthening brand credibility and showcasing global manufacturing experience and export capability.",
      tags: ["Web/App Design", "Brand Identity"],
      images: ["assets/img/featured-img/img-14-1.png", "assets/img/featured-img/img-14-2.png"],
    },
    {
      title: "Food Decision App",
      description:
        "A mobile UI concept designed to simplify food decision-making by guiding users through choices in an intuitive and engaging way.",
      tags: ["Web/App Design", "Brand Identity", "Logo Design"],
      images: [
        "assets/img/featured-img/img-15-1.png",
        "assets/img/featured-img/img-15-2.png",
        "assets/img/featured-img/img-15-3.png",
        "assets/img/featured-img/img-15-4.png",
        "assets/img/featured-img/img-15-5.png",
      ],
    },
  ];
  const featuredWorkCards = Array.from(document.querySelectorAll(".featured-work-card[data-project-index]"));
  const featuredWorkFilters = document.querySelector("[data-featured-filters]");

  function initializeFeaturedWorkFilters() {
    if (!featuredWorkFilters || featuredWorkCards.length === 0 || featuredProjects.length === 0) {
      return;
    }

    const selectedTags = new Set();
    const uniqueTags = [
      "Brand Identity",
      "Packaging Design",
      "Logo Design",
      "Brochure Design",
      "3D Visualization",
      "Web/App Design",
      "Graphic Design",
    ];

    function matchesSelectedTags(projectTags) {
      if (selectedTags.size === 0) {
        return true;
      }

      return projectTags.some(function (tag) {
        return selectedTags.has(tag);
      });
    }

    function updateFeaturedWorkVisibility() {
      featuredWorkCards.forEach(function (card) {
        const rawIndex = card.getAttribute("data-project-index") || "";
        const projectIndex = parseInt(rawIndex, 10) - 1;
        const project = featuredProjects[projectIndex];
        const projectTags = project && Array.isArray(project.tags) ? project.tags : [];
        const isVisible = matchesSelectedTags(projectTags);
        card.hidden = !isVisible;
      });
    }

    function renderFilterButtons() {
      featuredWorkFilters.innerHTML = "";

      uniqueTags.forEach(function (tag) {
        const button = document.createElement("button");
        const isActive = selectedTags.has(tag);
        button.type = "button";
        button.className = "featured-work-filter" + (isActive ? " is-active" : "");
        button.textContent = tag;
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
        button.addEventListener("click", function () {
          if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
          } else {
            selectedTags.add(tag);
          }
          renderFilterButtons();
          updateFeaturedWorkVisibility();
        });
        featuredWorkFilters.appendChild(button);
      });
    }

    renderFilterButtons();
    updateFeaturedWorkVisibility();
  }

  initializeFeaturedWorkFilters();

  const featuredModal = document.getElementById("featured-work-modal");
  const featuredModalBackdrop = featuredModal ? featuredModal.querySelector(".featured-modal__backdrop") : null;
  const featuredModalViewport = featuredModal ? featuredModal.querySelector("[data-featured-viewport]") : null;
  const featuredModalTrack = featuredModal ? featuredModal.querySelector("[data-featured-track]") : null;
  const featuredModalDots = featuredModal ? featuredModal.querySelector("[data-featured-dots]") : null;
  const featuredModalTitle = featuredModal ? featuredModal.querySelector("#featured-modal-title") : null;
  const featuredModalDescription = featuredModal ? featuredModal.querySelector("[data-featured-description]") : null;
  const featuredModalTags = featuredModal ? featuredModal.querySelector("[data-featured-tags]") : null;
  const featuredModalPrev = featuredModal ? featuredModal.querySelector("[data-featured-carousel-prev]") : null;
  const featuredModalNext = featuredModal ? featuredModal.querySelector("[data-featured-carousel-next]") : null;
  let featuredModalLastFocus = null;
  let featuredCarouselIndex = 0;
  let featuredCarouselSlideCount = 0;

  function applyFeaturedCarouselTransform() {
    if (!featuredModalViewport || !featuredModalTrack) {
      return;
    }
    const w = featuredModalViewport.clientWidth;
    if (w < 2) {
      return;
    }
    featuredModalTrack.style.transform = "translateX(" + -featuredCarouselIndex * w + "px)";
  }

  function setFeaturedCarouselIndexInstant(nextIndex) {
    if (!featuredModalTrack) {
      return;
    }
    featuredModalTrack.style.transition = "none";
    featuredCarouselIndex = nextIndex;
    applyFeaturedCarouselTransform();
    void featuredModalTrack.offsetHeight;
    featuredModalTrack.style.transition = "";
  }

  function onFeaturedTrackTransitionEnd(e) {
    if (e.target !== featuredModalTrack || e.propertyName !== "transform") {
      return;
    }
    if (!featuredModal || featuredModal.hasAttribute("hidden")) {
      return;
    }
    const n = featuredCarouselSlideCount;
    if (n <= 1) {
      return;
    }
    if (featuredCarouselIndex === n + 1) {
      setFeaturedCarouselIndexInstant(1);
      updateFeaturedCarouselUi();
    } else if (featuredCarouselIndex === 0) {
      setFeaturedCarouselIndexInstant(n);
      updateFeaturedCarouselUi();
    }
  }

  function layoutFeaturedCarousel() {
    if (!featuredModalViewport || !featuredModalTrack || !featuredModal || featuredModal.hasAttribute("hidden")) {
      return;
    }

    const slides = featuredModalTrack.querySelectorAll(".featured-modal__slide");
    const trackLen = slides.length;
    const w = featuredModalViewport.clientWidth;

    if (w < 2 || !trackLen) {
      return;
    }

    slides.forEach(function (slide) {
      slide.style.flex = "0 0 " + w + "px";
      slide.style.width = w + "px";
      slide.style.minWidth = w + "px";
    });

    if (trackLen > 0) {
      featuredCarouselIndex = Math.max(0, Math.min(trackLen - 1, featuredCarouselIndex));
    }
    applyFeaturedCarouselTransform();
    updateFeaturedCarouselUi();
  }

  function closeFeaturedWorkModal() {
    if (!featuredModal || featuredModal.hasAttribute("hidden")) {
      return;
    }

    featuredModal.setAttribute("hidden", "");
    featuredModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("featured-modal-open");

    featuredModal.classList.remove("is-single");
    featuredCarouselIndex = 0;
    featuredCarouselSlideCount = 0;

    if (featuredModalTrack) {
      featuredModalTrack.style.transform = "";
      featuredModalTrack.style.transition = "";
      featuredModalTrack.innerHTML = "";
    }
    if (featuredModalDots) {
      featuredModalDots.innerHTML = "";
    }

    if (featuredModalLastFocus && typeof featuredModalLastFocus.focus === "function") {
      featuredModalLastFocus.focus({ preventScroll: true });
    }
    featuredModalLastFocus = null;
  }

  function updateFeaturedCarouselUi() {
    if (!featuredModal || !featuredModalPrev || !featuredModalNext || !featuredModalDots) {
      return;
    }

    const isSingleSlide = featuredCarouselSlideCount <= 1;
    featuredModal.classList.toggle("is-single", isSingleSlide);

    const dotButtons = featuredModalDots.querySelectorAll(".featured-modal__dot");
    featuredModalDots.hidden = dotButtons.length <= 1;

    const n = featuredCarouselSlideCount;
    const realIndex = n > 0 ? (featuredCarouselIndex - 1 + n) % n : 0;

    dotButtons.forEach(function (dot, i) {
      dot.classList.toggle("active", i === realIndex);
      dot.classList.toggle("is-active", i === realIndex);
      dot.setAttribute("aria-current", i === realIndex ? "true" : "false");
    });
  }

  function scrollFeaturedCarouselBy(delta) {
    if (featuredCarouselSlideCount <= 1) {
      return;
    }
    featuredCarouselIndex += delta;
    applyFeaturedCarouselTransform();
    updateFeaturedCarouselUi();
  }

  function scrollFeaturedCarouselTo(index) {
    if (featuredCarouselSlideCount <= 0) {
      return;
    }
    if (featuredCarouselSlideCount === 1) {
      featuredCarouselIndex = 0;
    } else {
      featuredCarouselIndex = index + 1;
    }
    applyFeaturedCarouselTransform();
    updateFeaturedCarouselUi();
  }

  function createFeaturedModalSlide(src, projectTitle, loading) {
    const slide = document.createElement("div");
    slide.className = "featured-modal__slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = projectTitle + " — gallery image";
    img.loading = loading ? "eager" : "lazy";
    img.addEventListener("load", layoutFeaturedCarousel);
    img.addEventListener("error", layoutFeaturedCarousel);
    slide.appendChild(img);
    return slide;
  }

  function openFeaturedWorkModal(projectIndex) {
    if (!featuredModal || !featuredModalTrack || !featuredModalTitle || !featuredModalDescription || !featuredModalTags) {
      return;
    }

    const project = featuredProjects[projectIndex - 1];
    if (!project) {
      return;
    }

    featuredModalLastFocus = document.activeElement;
    featuredModal.removeAttribute("hidden");
    featuredModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("featured-modal-open");

    featuredModalTitle.textContent = project.title;
    featuredModalDescription.textContent = project.description;
    featuredModalTags.innerHTML = "";
    project.tags.forEach(function (tag) {
      const li = document.createElement("li");
      li.className = "featured-modal__tag";
      li.textContent = tag;
      featuredModalTags.appendChild(li);
    });

    const imageCount = project.images.length;
    featuredCarouselSlideCount = imageCount;
    featuredCarouselIndex = imageCount <= 1 ? 0 : 1;

    featuredModalTrack.innerHTML = "";
    if (imageCount === 1) {
      featuredModalTrack.appendChild(createFeaturedModalSlide(project.images[0], project.title, true));
    } else if (imageCount > 1) {
      featuredModalTrack.appendChild(createFeaturedModalSlide(project.images[imageCount - 1], project.title, false));
      project.images.forEach(function (src, imageIndex) {
        featuredModalTrack.appendChild(createFeaturedModalSlide(src, project.title, imageIndex === 0));
      });
      featuredModalTrack.appendChild(createFeaturedModalSlide(project.images[0], project.title, false));
    }

    featuredModalDots.innerHTML = "";
    project.images.forEach(function (_, dotIndex) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "featured-modal__dot";
      dot.setAttribute("aria-label", "Go to image " + (dotIndex + 1));
      dot.addEventListener("click", function () {
        scrollFeaturedCarouselTo(dotIndex);
      });
      featuredModalDots.appendChild(dot);
    });

    window.requestAnimationFrame(function () {
      layoutFeaturedCarousel();
      window.requestAnimationFrame(function () {
        layoutFeaturedCarousel();
        let focusTarget = featuredModalTitle;
        if (featuredCarouselSlideCount > 1 && featuredModalPrev && featuredModalPrev.hidden !== true) {
          focusTarget = featuredModalPrev;
        }
        if (focusTarget && typeof focusTarget.focus === "function") {
          focusTarget.focus({ preventScroll: true });
        }
      });
    });
  }

  if (
    featuredModal &&
    featuredModalBackdrop &&
    featuredModalViewport &&
    featuredModalTrack &&
    featuredModalDots &&
    featuredModalTitle &&
    featuredModalDescription &&
    featuredModalTags &&
    featuredModalPrev &&
    featuredModalNext
  ) {
    featuredModalBackdrop.addEventListener("click", function () {
      closeFeaturedWorkModal();
    });

    window.addEventListener("resize", function () {
      if (!featuredModal.hasAttribute("hidden")) {
        layoutFeaturedCarousel();
      }
    });

    featuredModalTrack.addEventListener("transitionend", onFeaturedTrackTransitionEnd);

    featuredModalPrev.addEventListener("click", function () {
      scrollFeaturedCarouselBy(-1);
    });

    featuredModalNext.addEventListener("click", function () {
      scrollFeaturedCarouselBy(1);
    });

    featuredWorkCards.forEach(function (card) {
      function openFromCard() {
        const raw = card.getAttribute("data-project-index") || "";
        const idx = parseInt(raw, 10);
        if (!Number.isFinite(idx)) {
          return;
        }
        openFeaturedWorkModal(idx);
      }

      card.addEventListener("click", openFromCard);

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFromCard();
        }
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (featuredModal && !featuredModal.hasAttribute("hidden")) {
      event.preventDefault();
      closeFeaturedWorkModal();
      return;
    }
    escapeNavHandler();
  });

  document.querySelectorAll("[data-marquee]").forEach(function (track) {
    if (track.getAttribute("data-ready") === "true") {
      return;
    }

    track.innerHTML += track.innerHTML;
    track.setAttribute("data-ready", "true");
  });

  document.querySelectorAll("[data-carousel-wrapper]").forEach(function (wrapper) {
    const carousel = wrapper.querySelector("[data-carousel]");
    const slides = Array.from(wrapper.querySelectorAll(".carousel-slide"));
    const prevButton = wrapper.querySelector("[data-prev]");
    const nextButton = wrapper.querySelector("[data-next]");

    if (!carousel || slides.length === 0) {
      return;
    }

    let currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });

    if (currentIndex < 0) {
      currentIndex = 0;
    }

    function setSlide(nextIndex) {
      slides.forEach(function (slide, index) {
        slide.classList.toggle("is-active", index === nextIndex);
      });
      currentIndex = nextIndex;
    }

    function goNext() {
      setSlide((currentIndex + 1) % slides.length);
    }

    function goPrev() {
      setSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    setSlide(currentIndex);

    if (slides.length < 2) {
      if (prevButton) {
        prevButton.hidden = true;
      }
      if (nextButton) {
        nextButton.hidden = true;
      }
      return;
    }

    if (prevButton) {
      prevButton.addEventListener("click", goPrev);
    }

    if (nextButton) {
      nextButton.addEventListener("click", goNext);
    }

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    });
  });
})();
