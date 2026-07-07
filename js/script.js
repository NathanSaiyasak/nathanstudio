(function () {
  var LANG_STORAGE_KEY = "portfolio-lang";
  var currentLang = "en";
  var refreshFeaturedFilters = null;
  var refreshOpenFeaturedModal = null;
  var activeFeaturedProjectIndex = null;

  function getStoredLang() {
    try {
      var stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "en" || stored === "th") {
        return stored;
      }
    } catch (error) {
      /* ignore */
    }
    return "en";
  }

  function t(path, vars) {
    var strings = typeof SITE_STRINGS !== "undefined" ? SITE_STRINGS[currentLang] : null;
    if (!strings && typeof SITE_STRINGS !== "undefined") {
      strings = SITE_STRINGS.en;
    }
    if (!strings) {
      return "";
    }

    var parts = String(path).split(".");
    var value = strings;
    for (var i = 0; i < parts.length; i += 1) {
      if (value == null) {
        value = undefined;
        break;
      }
      value = value[parts[i]];
    }

    if (typeof value !== "string") {
      return "";
    }

    if (!vars) {
      return value;
    }

    return Object.keys(vars).reduce(function (result, key) {
      return result.replace(new RegExp("\\{" + key + "\\}", "g"), vars[key]);
    }, value);
  }

  function getTagLabel(tag) {
    if (typeof SITE_TAG_LABELS === "undefined" || !SITE_TAG_LABELS[tag]) {
      return tag;
    }
    var labels = SITE_TAG_LABELS[tag];
    return labels[currentLang] || labels.en || tag;
  }

  function getProjectDescription(project, projectIndex) {
    if (
      currentLang === "th" &&
      typeof PROJECT_DESCRIPTIONS_TH !== "undefined" &&
      PROJECT_DESCRIPTIONS_TH[projectIndex]
    ) {
      return PROJECT_DESCRIPTIONS_TH[projectIndex];
    }
    return project.description;
  }

  function applyI18n() {
    document.documentElement.lang = currentLang === "th" ? "th" : "en";
    document.documentElement.dataset.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (key) {
        element.textContent = t(key);
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-html");
      if (key) {
        element.innerHTML = t(key);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-aria");
      if (key) {
        element.setAttribute("aria-label", t(key));
      }
    });

    document.querySelectorAll("[data-i18n-caption]").forEach(function (element) {
      var index = element.getAttribute("data-i18n-caption");
      if (index) {
        element.textContent = t("projects.captions." + index);
      }
    });

    document.querySelectorAll("[data-i18n-project-open]").forEach(function (element) {
      var title = element.getAttribute("data-project-title") || "";
      element.setAttribute("aria-label", t("projects.open", { title: title }));
    });

    document.querySelectorAll("[data-i18n-marquee-index]").forEach(function (element) {
      var index = parseInt(element.getAttribute("data-i18n-marquee-index"), 10);
      var pills =
        typeof SITE_STRINGS !== "undefined" && SITE_STRINGS[currentLang]
          ? SITE_STRINGS[currentLang].marquee.pills
          : null;
      if (pills && pills[index] != null) {
        element.textContent = pills[index];
      }
    });

    document.querySelectorAll("[data-i18n-split]").forEach(function (wrapper) {
      var key = wrapper.getAttribute("data-i18n-split");
      var full = t(key);
      var chars = Array.from(full);
      var first = wrapper.querySelector(".specialization-first-letter");
      var rest = wrapper.querySelector("[data-i18n-split-rest]");
      if (first && rest) {
        first.textContent = chars[0] || "";
        rest.textContent = chars.slice(1).join("");
      }
    });

    var featuredFilters = document.querySelector("[data-featured-filters]");
    if (featuredFilters) {
      featuredFilters.setAttribute("aria-label", t("featured.filtersAria"));
    }

    if (document.body.classList.contains("rate-card-page")) {
      document.title = t("rateCard.meta.title");
    } else {
      document.title = t("meta.title");
    }

    if (typeof refreshFeaturedFilters === "function") {
      refreshFeaturedFilters();
    }

    if (typeof refreshOpenFeaturedModal === "function") {
      refreshOpenFeaturedModal();
    }
  }

  function setLanguage(lang) {
    if (lang !== "en" && lang !== "th") {
      return;
    }

    currentLang = lang;

    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (error) {
      /* ignore */
    }

    document.querySelectorAll("[data-lang-toggle] .site-lang-toggle__button").forEach(function (button) {
      var isActive = button.getAttribute("data-lang") === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    applyI18n();
  }

  function initializeSiteLanguage() {
    currentLang = getStoredLang();

    document.querySelectorAll("[data-lang-toggle]").forEach(function (toggle) {
      toggle.querySelectorAll(".site-lang-toggle__button").forEach(function (button) {
        button.addEventListener("click", function () {
          var lang = button.getAttribute("data-lang");
          if (lang) {
            setLanguage(lang);
          }
        });
      });
    });

    setLanguage(currentLang);
  }

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
      tags: ["Packaging Design", "Brand Identity", "Logo Design", "3D Visualization", "UX/UI Design"],
      images: [
        "assets/img/featured-img/img-1-1.webp",
        "assets/img/featured-img/img-1-2.webp",
        "assets/img/featured-img/img-1-3.webp",
        "assets/img/featured-img/img-1-4.webp",
      ],
    },
    {
      title: "CQUARE Website",
      description:
        "'CQUARE' is more than a brand; it's your gateway to effortless fashion. The mission? To bring you closer to your wardrobe dreams with just a click. I believe in the power of choice, the elegance of simplicity, and the accessibility of fashion for everyone. From the minimalistic design of the logo to the seamless experience of the website, every thread we weave is crafted with your convenience in mind.",
      tags: ["UX/UI Design", "Logo Design", "Brand Identity"],
      images: [
        "assets/img/featured-img/img-2-1.webp",
        "assets/img/featured-img/img-2-2.webp",
        "assets/img/featured-img/img-2-3.webp",
        "assets/img/featured-img/img-2-4.webp",
      ],
    },
    {
      title: "Sailer Branding",
      description: "A coastal-inspired visual identity and social media campaign designed to promote Sailer Resort through a clean, tropical, and travel-focused brand experience.",
      tags: ["Brand Identity", "Logo Design", "Graphic Design"],
      images: ["assets/img/featured-img/img-3-1.webp", "assets/img/featured-img/img-3-2.webp"],
    },
    {
      title: "LYDUS – Brand & Packaging System",
      description:
        "An end-to-end design system for LYDUS nitrile gloves, spanning branding, packaging, 3D renders, and marketing visuals. Built to communicate clarity, trust, and consistency across both medical and commercial contexts.",
      tags: ["Brand Identity", "Packaging Design", "3D Visualization"],
      images: [
        "assets/img/featured-img/img-4-1.webp",
        "assets/img/featured-img/img-4-2.webp",
        "assets/img/featured-img/img-4-3.webp",
      ],
    },
    {
      title: "Training Campaign",
      description: "A high-impact promotional visual designed to capture attention and drive sign-ups for a professional training event.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-5-1.webp"],
    },
    {
      title: "LINE OA Experience",
      description:
        "A modular rich menu system designed to guide users through eco-friendly travel choices with clarity, structure, and intuitive interaction.",
      tags: ["UX/UI Design"],
      images: ["assets/img/featured-img/img-6-1.webp", "assets/img/featured-img/img-6-2.webp"],
    },
    {
      title: "Vacation Bible School Campaign",
      description:
        "An engaging event visual designed to communicate key information clearly while maintaining a playful and energetic tone.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-7-1.webp", "assets/img/featured-img/img-7-2.webp"],
    },
    {
      title: "Medical Product Brochure",
      description:
        "A structured brochure designed to communicate product reliability, range, and mission-driven impact with clarity and trust.",
      tags: ["Brochure Design"],
      images: ["assets/img/featured-img/img-8-1.webp", "assets/img/featured-img/img-8-2.webp"],
    },
    {
      title: "Infrastructure Company Brochure",
      description:
        "A corporate brochure designed to present complex service information with clarity while reinforcing a strong and credible brand presence.",
      tags: ["Brochure Design", "Brand Identity"],
      images: ["assets/img/featured-img/img-9-1.webp", "assets/img/featured-img/img-9-2.webp"],
    },
    {
      title: "VitalNest Branding",
      description: "A premium packaging design for a wellness brand, crafted to communicate quality, calmness, and trust through a nature-inspired visual identity.",
      tags: ["Packaging Design", "Brand Identity", "3D Visualization"],
      images: ["assets/img/featured-img/img-10-1.webp", "assets/img/featured-img/img-10-2.webp"],
    },
    {
      title: "PLEō Brand Identity",
      description:
        "A cohesive brand system for a microgreens startup, positioning the product as a premium health offering through clean visuals and consistent storytelling.",
      tags: ["Brand Identity", "Logo Design"],
      images: [
        "assets/img/featured-img/img-11-1.webp",
        "assets/img/featured-img/img-11-2.webp",
        "assets/img/featured-img/img-11-3.webp",
        "assets/img/featured-img/img-11-4.webp",
        "assets/img/featured-img/img-11-5.webp",
      ],
    },
    {
      title: "Believe – Youth Camp Campaign",
      description:
        "A campaign visual designed to inspire emotional connection and clearly communicate the message of a youth camp experience.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-12-1.webp", "assets/img/featured-img/img-12-2.webp"],
    },
    {
      title: "Training Campaign Poster",
      description: "A promotional poster designed to capture attention and drive attendance for a professional talk and training event.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-13-1.webp"],
    },
    {
      title: "Corporate Website",
      description:
        "A corporate website redesign focused on strengthening brand credibility and showcasing global manufacturing experience and export capability.",
      tags: ["UX/UI Design", "Brand Identity"],
      images: ["assets/img/featured-img/img-14-1.webp", "assets/img/featured-img/img-14-2.webp"],
    },
    {
      title: "Food Decision App",
      description:
        "A mobile UI concept designed to simplify food decision-making by guiding users through choices in an intuitive and engaging way.",
      tags: ["UX/UI Design", "Brand Identity", "Logo Design"],
      images: [
        "assets/img/featured-img/img-15-1.webp",
        "assets/img/featured-img/img-15-2.webp",
        "assets/img/featured-img/img-15-3.webp",
        "assets/img/featured-img/img-15-4.webp",
        "assets/img/featured-img/img-15-5.webp",
      ],
    },
    {
      title: "Zera Brochure",
      description:
        "A brochure design for Zera that communicates wellness, natural ingredients, and brand trust through a clean editorial layout, soft botanical visuals, and a calm semi-premium design direction.",
      tags: ["Brand Identity", "Brochure Design", "Graphic Design"],
      images: [
        "assets/img/featured-img/img-16.webp",
        "assets/img/featured-img/img-16-1.webp",
        "assets/img/featured-img/img-16-2.webp",
      ],
    },
    {
      title: "Poster Design for Youth Camp",
      description:
        "A high-visibility poster design created for a youth camp campaign, using strong hierarchy, energetic composition, and clear event information to make the promotion easy to notice and understand.",
      tags: ["Graphic Design"],
      images: ["assets/img/featured-img/img-17.webp", "assets/img/featured-img/img-17-1.webp"],
    },
    {
      title: "BASCII 004",
      description:
        "A comprehensive visual campaign for BASCII 004, a secret-agent-themed Rub Nong orientation. The system includes teaser graphics, timeline materials, TOP SECRET reveals, a character poster, formal invitation, and a bold key visual banner in a high-contrast red, black, and cream palette.",
      tags: ["Graphic Design", "Brand Identity"],
      images: [
        "assets/img/featured-img/img-18.webp",
        "assets/img/featured-img/img-18-1.webp",
        "assets/img/featured-img/img-18-2.webp",
        "assets/img/featured-img/img-18-3.webp",
        "assets/img/featured-img/img-18-4.webp",
      ],
    },
    {
      title: "Tachy",
      description:
        "Brand identity and digital presentation for Tachy, a travel-inspired lifestyle brand. The work includes a gradient ribbon logo, italic wordmark, mobile UI mockups, and soft gradient brand elements designed for a clean, energetic digital-first presence.",
      tags: ["Brand Identity", "Logo Design", "UX/UI Design"],
      images: [
        "assets/img/featured-img/img-19.webp",
        "assets/img/featured-img/img-19-1.webp",
        "assets/img/featured-img/img-19-2.webp",
      ],
    },
    {
      title: "Event Merchandise Design",
      description:
        "Custom merchandise created for an event, designed to extend the event identity into a wearable and memorable visual piece. The design focused on creating something clean, recognizable, and community-driven while still feeling polished enough for real event use.",
      tags: ["Merch"],
      images: [
        "assets/img/featured-img/img-20.webp",
        "assets/img/featured-img/img-20-1.webp",
        "assets/img/featured-img/img-20-2.webp",
        "assets/img/featured-img/img-20-3.webp",
        "assets/img/featured-img/img-20-4.webp",
      ],
    },
    {
      title: "zera Packaging Design",
      description:
        "Packaging design for zera, a purpose-driven natural food brand. The design balances a warm, healthy brand identity with clear product communication, using natural colors, clean hierarchy, and shelf-ready presentation to make the product feel trustworthy and approachable.",
      tags: ["Packaging Design"],
      images: [
        "assets/img/featured-img/img-21.webp",
        "assets/img/featured-img/img-21-1.webp",
        "assets/img/featured-img/img-21-2.webp",
        "assets/img/featured-img/img-21-3.webp",
      ],
    },
    {
      title: "zera Website",
      description:
        "A live brand and product website for zera, created to introduce the brand story, product range, and purpose-driven mission. The site focuses on natural visuals, calm typography, product education, and a warm user experience that reflects the brand's healthy and community-centered identity.",
      tags: ["Website Design"],
      link: "https://nathantrad.com/zera/index.html",
      images: [
        "assets/img/featured-img/img-22.webp",
        "assets/img/featured-img/img-22-1.webp",
        "assets/img/featured-img/img-22-2.webp",
      ],
    },
    {
      title: "Mekong Website",
      description:
        "A live website for Mekong Evangelical organization, designed to communicate its mission, programs, and community impact with a clear and accessible structure. The work focused on improving credibility, storytelling, and ease of navigation for visitors, supporters, and donors.",
      tags: ["Website Design"],
      link: "https://mekongevan.org",
      images: [
        "assets/img/featured-img/img-23.webp",
        "assets/img/featured-img/img-23-1.webp",
        "assets/img/featured-img/img-23-2.webp",
      ],
    },
    {
      title: "LYDUS Gloves Website",
      description:
        "A professional website for LYDUS Gloves, a nitrile glove brand, designed to present product information, brand credibility, and B2B value clearly. The site emphasizes trust, clarity, and practical product presentation for buyers, partners, and business customers.",
      tags: ["Website Design"],
      link: "https://lydusgloves.com",
      images: [
        "assets/img/featured-img/img-24.webp",
        "assets/img/featured-img/img-24-1.webp",
        "assets/img/featured-img/img-24-2.webp",
        "assets/img/featured-img/img-24-3.webp",
      ],
    },
    {
      title: "Startup Pitch Deck",
      description:
        "Pitch deck for a startup project, structured to communicate the problem, solution, market opportunity, business model, and go-to-market strategy in a clear investor-friendly format. The design focused on concise storytelling, visual hierarchy, and making the business idea easy to understand.",
      tags: ["Pitch Deck"],
      images: [
        "assets/img/featured-img/img-25.webp",
        "assets/img/featured-img/img-25-1.webp",
        "assets/img/featured-img/img-25-2.webp",
        "assets/img/featured-img/img-25-3.webp",
        "assets/img/featured-img/img-25-4.webp",
        "assets/img/featured-img/img-25-5.webp",
        "assets/img/featured-img/img-25-6.webp",
      ],
    },
    {
      title: "LYDUS Brand Pitch Deck",
      description:
        "Pitch deck for the LYDUS brand, designed to present the product, market positioning, business opportunity, and growth strategy. The deck focused on creating a polished B2B brand narrative for sales conversations, partnerships, and investor-facing presentations.",
      tags: ["Pitch Deck"],
      images: [
        "assets/img/featured-img/img-26.webp",
        "assets/img/featured-img/img-26-1.webp",
        "assets/img/featured-img/img-26-2.webp",
        "assets/img/featured-img/img-26-3.webp",
        "assets/img/featured-img/img-26-4.webp",
        "assets/img/featured-img/img-26-5.webp",
        "assets/img/featured-img/img-26-6.webp",
      ],
    },
    {
      title: "NILA Solutions Brochure",
      description:
        "A brochure design for NILA Solutions, a company offering construction-related services such as stockpile auditing, cut and fill work, videography, and mapping. The goal was to communicate technical services in a clear, visual, and contractor-friendly way while making the company feel professional, capable, and easy to understand.",
      tags: ["Brochure Design"],
      images: [
        "assets/img/featured-img/img-27.webp",
        "assets/img/featured-img/img-27-2.webp",
      ],
    },
  ];
  const featuredWorkCards = Array.from(document.querySelectorAll(".featured-work-card[data-project-index]"));
  const featuredWorkFilters = document.querySelector("[data-featured-filters]");

  function initializeFeaturedWorkFilters() {
    if (!featuredWorkFilters || featuredWorkCards.length === 0 || featuredProjects.length === 0) {
      return;
    }

    let selectedTag = null;
    const uniqueTags = [
      "Brand Identity",
      "Packaging Design",
      "Website Design",
      "UX/UI Design",
      "Logo Design",
      "Brochure Design",
      "3D Visualization",
      "Graphic Design",
      "Merch",
      "Pitch Deck",
    ];

    function matchesSelectedTags(projectTags) {
      if (selectedTag === null) {
        return true;
      }

      return projectTags.includes(selectedTag);
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
        const isActive = selectedTag === tag;
        button.type = "button";
        button.className = "featured-work-filter" + (isActive ? " is-active" : "");
        button.textContent = getTagLabel(tag);
        button.setAttribute("aria-pressed", String(isActive));
        button.addEventListener("click", function () {
          if (selectedTag === tag) {
            selectedTag = null;
          } else {
            selectedTag = tag;
          }
          renderFilterButtons();
          updateFeaturedWorkVisibility();
        });
        featuredWorkFilters.appendChild(button);
      });
    }

    refreshFeaturedFilters = function () {
      renderFilterButtons();
      updateFeaturedWorkVisibility();
    };

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
  const featuredModalLink = featuredModal ? featuredModal.querySelector("[data-featured-link]") : null;
  const featuredModalPrev = featuredModal ? featuredModal.querySelector("[data-featured-carousel-prev]") : null;
  const featuredModalNext = featuredModal ? featuredModal.querySelector("[data-featured-carousel-next]") : null;
  const featuredModalPanel = featuredModal ? featuredModal.querySelector(".featured-modal__panel") : null;
  let featuredModalLastFocus = null;
  let featuredCarouselIndex = 0;
  let featuredCarouselSlideCount = 0;
  let featuredCarouselIsAnimating = false;
  let featuredCarouselAnimateTimer = null;

  function beginFeaturedCarouselAnimation() {
    featuredCarouselIsAnimating = true;
    if (featuredCarouselAnimateTimer) {
      window.clearTimeout(featuredCarouselAnimateTimer);
    }
    featuredCarouselAnimateTimer = window.setTimeout(function () {
      featuredCarouselIsAnimating = false;
      featuredCarouselAnimateTimer = null;
    }, 380);
  }

  function resetFeaturedCarouselAnimation() {
    featuredCarouselIsAnimating = false;
    if (featuredCarouselAnimateTimer) {
      window.clearTimeout(featuredCarouselAnimateTimer);
      featuredCarouselAnimateTimer = null;
    }
  }

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
    activeFeaturedProjectIndex = null;

    featuredModal.classList.remove("is-single");
    resetFeaturedCarouselAnimation();
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
    if (featuredCarouselIsAnimating) {
      return;
    }
    beginFeaturedCarouselAnimation();
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
      applyFeaturedCarouselTransform();
      updateFeaturedCarouselUi();
      return;
    }
    if (featuredCarouselIsAnimating) {
      return;
    }
    const targetIndex = index + 1;
    if (targetIndex === featuredCarouselIndex) {
      return;
    }
    beginFeaturedCarouselAnimation();
    featuredCarouselIndex = targetIndex;
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
    img.decoding = "async";
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
    activeFeaturedProjectIndex = projectIndex;
    featuredModal.removeAttribute("hidden");
    featuredModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("featured-modal-open");

    featuredModalTitle.textContent = project.title;
    featuredModalDescription.textContent = getProjectDescription(project, projectIndex - 1);
    featuredModalTags.innerHTML = "";
    project.tags.forEach(function (tag) {
      const li = document.createElement("li");
      li.className = "featured-modal__tag";
      li.textContent = getTagLabel(tag);
      featuredModalTags.appendChild(li);
    });

    if (featuredModalLink) {
      featuredModalLink.setAttribute("hidden", "");
      featuredModalLink.setAttribute("aria-hidden", "true");
      featuredModalLink.removeAttribute("href");

      var isWebsiteProject =
        Array.isArray(project.tags) && project.tags.includes("Website Design");
      var hasValidProjectLink =
        typeof project.link === "string" && project.link.trim().length > 0;
      var shouldShowVisitWebsite = isWebsiteProject && hasValidProjectLink;

      if (shouldShowVisitWebsite) {
        featuredModalLink.href = project.link.trim();
        featuredModalLink.removeAttribute("hidden");
        featuredModalLink.removeAttribute("aria-hidden");
      }
    }

    if (featuredModalPrev) {
      featuredModalPrev.setAttribute("aria-label", t("modal.prev"));
    }
    if (featuredModalNext) {
      featuredModalNext.setAttribute("aria-label", t("modal.next"));
    }
    if (featuredModalDots) {
      featuredModalDots.setAttribute("aria-label", t("modal.carousel"));
    }

    resetFeaturedCarouselAnimation();

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
      dot.setAttribute("aria-label", t("modal.goToImage") + " " + (dotIndex + 1));
      dot.addEventListener("click", function () {
        scrollFeaturedCarouselTo(dotIndex);
      });
      featuredModalDots.appendChild(dot);
    });

    featuredModalTrack.style.transition = "none";

    window.requestAnimationFrame(function () {
      layoutFeaturedCarousel();
      window.requestAnimationFrame(function () {
        layoutFeaturedCarousel();
        void featuredModalTrack.offsetHeight;
        featuredModalTrack.style.transition = "";
        const focusTarget = featuredModalPanel || featuredModalTitle;
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

    (function initFeaturedCarouselDrag() {
      let isDragging = false;
      let pointerId = null;
      let startX = 0;
      let startY = 0;
      let dragDelta = 0;
      let lockedHorizontal = false;
      let decidedDirection = false;

      function currentWidth() {
        return featuredModalViewport ? featuredModalViewport.clientWidth : 0;
      }

      function onPointerDown(event) {
        if (event.button !== undefined && event.button !== 0) {
          return;
        }
        if (featuredCarouselSlideCount <= 1 || featuredCarouselIsAnimating) {
          return;
        }
        isDragging = true;
        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        dragDelta = 0;
        lockedHorizontal = false;
        decidedDirection = false;
        featuredModalTrack.style.transition = "none";
        featuredModalViewport.classList.add("is-dragging");
      }

      function onPointerMove(event) {
        if (!isDragging || event.pointerId !== pointerId) {
          return;
        }

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (!decidedDirection) {
          if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
            return;
          }
          decidedDirection = true;
          lockedHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
          if (lockedHorizontal && featuredModalViewport.setPointerCapture) {
            try {
              featuredModalViewport.setPointerCapture(pointerId);
            } catch (error) {
              /* ignore */
            }
          }
        }

        if (!lockedHorizontal) {
          return;
        }

        event.preventDefault();
        dragDelta = deltaX;
        const w = currentWidth();
        if (w >= 2) {
          featuredModalTrack.style.transform =
            "translateX(" + (-featuredCarouselIndex * w + dragDelta) + "px)";
        }
      }

      function finishDrag() {
        if (!isDragging) {
          return;
        }
        isDragging = false;
        featuredModalViewport.classList.remove("is-dragging");
        if (pointerId !== null && featuredModalViewport.releasePointerCapture) {
          try {
            featuredModalViewport.releasePointerCapture(pointerId);
          } catch (error) {
            /* ignore */
          }
        }

        featuredModalTrack.style.transition = "";

        const w = currentWidth();
        const threshold = w > 0 ? Math.min(60, Math.max(40, w * 0.18)) : 50;
        const delta = dragDelta;
        pointerId = null;
        dragDelta = 0;

        if (lockedHorizontal && Math.abs(delta) >= threshold) {
          scrollFeaturedCarouselBy(delta < 0 ? 1 : -1);
        } else {
          applyFeaturedCarouselTransform();
        }
        lockedHorizontal = false;
        decidedDirection = false;
      }

      featuredModalViewport.addEventListener("pointerdown", onPointerDown);
      featuredModalViewport.addEventListener("pointermove", onPointerMove);
      featuredModalViewport.addEventListener("pointerup", finishDrag);
      featuredModalViewport.addEventListener("pointercancel", finishDrag);
      featuredModalViewport.addEventListener("dragstart", function (event) {
        event.preventDefault();
      });
    })();

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

  function initializeRateCardCurrencyToggle() {
    const toggle = document.querySelector("[data-rate-currency-toggle]");
    if (!toggle || !document.body.classList.contains("rate-card-page")) {
      return;
    }

    const priceBadges = document.querySelectorAll(".rate-card-page .rate-card-package__price[data-price-usd]");
    if (!priceBadges.length) {
      return;
    }

    const buttons = toggle.querySelectorAll(".rate-card-currency-toggle__button");
    const USD_TO_THB = 32.86;

    function parseUsdAmount(usdDisplay) {
      return parseFloat(String(usdDisplay).replace(/[^0-9.]/g, ""), 10);
    }

    function formatThbFromUsd(usdAmount) {
      const converted = usdAmount * USD_TO_THB;
      const rounded = Math.round(converted / 100) * 100;
      return "฿" + rounded.toLocaleString("en-US");
    }

    function setCurrency(currency) {
      buttons.forEach(function (button) {
        const isActive = button.getAttribute("data-currency") === currency;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      priceBadges.forEach(function (badge) {
        const usdDisplay = badge.getAttribute("data-price-usd");
        if (!usdDisplay) {
          return;
        }

        if (currency === "thb") {
          const thbOverride = badge.getAttribute("data-price-thb");
          let thbDisplay;
          if (thbOverride && thbOverride.trim().length > 0) {
            thbDisplay = thbOverride.trim();
          } else {
            const usdAmount = parseUsdAmount(usdDisplay);
            if (!Number.isFinite(usdAmount)) {
              return;
            }
            thbDisplay = formatThbFromUsd(usdAmount);
          }
          badge.textContent = thbDisplay;
          badge.setAttribute("aria-label", "Price " + thbDisplay);
          return;
        }

        badge.textContent = usdDisplay;
        badge.setAttribute("aria-label", "Price " + usdDisplay);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const currency = button.getAttribute("data-currency");
        if (!currency) {
          return;
        }
        setCurrency(currency);
      });
    });
  }

  function refreshFeaturedModalI18n() {
    if (!featuredModal || featuredModal.hasAttribute("hidden") || activeFeaturedProjectIndex == null) {
      return;
    }

    const project = featuredProjects[activeFeaturedProjectIndex - 1];
    if (!project || !featuredModalDescription || !featuredModalTags) {
      return;
    }

    featuredModalDescription.textContent = getProjectDescription(project, activeFeaturedProjectIndex - 1);
    featuredModalTags.innerHTML = "";
    project.tags.forEach(function (tag) {
      const li = document.createElement("li");
      li.className = "featured-modal__tag";
      li.textContent = getTagLabel(tag);
      featuredModalTags.appendChild(li);
    });

    if (featuredModalPrev) {
      featuredModalPrev.setAttribute("aria-label", t("modal.prev"));
    }
    if (featuredModalNext) {
      featuredModalNext.setAttribute("aria-label", t("modal.next"));
    }
    if (featuredModalDots) {
      featuredModalDots.setAttribute("aria-label", t("modal.carousel"));
      featuredModalDots.querySelectorAll(".featured-modal__dot").forEach(function (dot, dotIndex) {
        dot.setAttribute("aria-label", t("modal.goToImage") + " " + (dotIndex + 1));
      });
    }
  }

  refreshOpenFeaturedModal = refreshFeaturedModalI18n;

  initializeRateCardCurrencyToggle();
  initializeSiteLanguage();
})();
