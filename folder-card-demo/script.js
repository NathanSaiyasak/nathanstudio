(function () {
  const card = document.querySelector("[data-folder-card]");
  if (!card) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function setOpenState(isOpen) {
    card.classList.toggle("is-open", isOpen);
    card.setAttribute("aria-expanded", String(isOpen));
  }

  function closeIfOutside(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (!card.contains(target)) {
      setOpenState(false);
    }
  }

  function attachDesktopBehavior() {
    card.addEventListener("mouseenter", function () {
      setOpenState(true);
    });

    card.addEventListener("mouseleave", function () {
      setOpenState(false);
    });

    card.addEventListener("focus", function () {
      setOpenState(true);
    });

    card.addEventListener("blur", function () {
      setOpenState(false);
    });
  }

  function attachTouchBehavior() {
    card.addEventListener("click", function (event) {
      event.preventDefault();
      setOpenState(!card.classList.contains("is-open"));
    });

    document.addEventListener("pointerdown", closeIfOutside);
  }

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenState(!card.classList.contains("is-open"));
    }

    if (event.key === "Escape") {
      setOpenState(false);
    }
  });

  if (supportsHover) {
    attachDesktopBehavior();
  } else {
    attachTouchBehavior();
  }

  if (prefersReducedMotion) {
    setOpenState(false);
  }
})();
