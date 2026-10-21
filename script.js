
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. MOBILE MENU
  // ==========================================

  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");
  const navigationLinks = document.querySelectorAll(".header nav a");

  if (header && burger) {
    burger.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.textContent = isOpen ? "✕" : "☰";
    });

    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰";
      });
    });
  }

  // ==========================================
  // 2. REVEAL ANIMATIONS
  // ==========================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // ==========================================
  // 3. HORIZONTAL GALLERY DRAG
  // ==========================================

  const gallery = document.querySelector("#galleryTrack");

  if (gallery) {
    let isDragging = false;
    let startX = 0;
    let initialScroll = 0;
    let moved = false;

    gallery.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      if (event.target.closest("button")) return;

      isDragging = true;
      moved = false;
      startX = event.pageX;
      initialScroll = gallery.scrollLeft;
    });

    gallery.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      const distance = event.pageX - startX;

      if (Math.abs(distance) > 5) {
        moved = true;
      }

      if (moved) {
        gallery.scrollLeft = initialScroll - distance;
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    gallery.addEventListener("mouseleave", () => {
      isDragging = false;
    });
  }

  // ==========================================
  // 4. ARTWORK LIGHTBOX
  // ==========================================

  const lightbox = document.querySelector("#lightbox");
  const bigImage = document.querySelector("#big");
  const counter = document.querySelector("#count");
  const closeButton = document.querySelector("#close");
  const previousButton = document.querySelector("#prev");
  const nextButton = document.querySelector("#next");

  const artworkImages = Array.from(
    document.querySelectorAll("#galleryTrack .art img")
  );

  let currentArtwork = 0;
  let previousFocus = null;

  function updateArtwork(index) {
    if (!artworkImages.length || !bigImage) return;

    currentArtwork =
      (index + artworkImages.length) % artworkImages.length;

    const image = artworkImages[currentArtwork];

    bigImage.src = image.src;
    bigImage.alt = image.alt || `Artwork ${currentArtwork + 1}`;

    if (counter) {
      counter.textContent =
        `ART ${String(currentArtwork + 1).padStart(2, "0")} / ` +
        String(artworkImages.length).padStart(2, "0");
    }
  }

  function openLightbox(index) {
    if (!lightbox || !artworkImages.length) return;

    previousFocus = document.activeElement;

    updateArtwork(index);

    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (bigImage) {
      bigImage.removeAttribute("src");
    }

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  artworkImages.forEach((image, index) => {
    const button = image.closest(".art-open");

    if (button) {
      button.addEventListener("click", () => {
        openLightbox(index);
      });
    } else {
      image.addEventListener("click", () => {
        openLightbox(index);
      });
    }
  });

  closeButton?.addEventListener("click", closeLightbox);

  previousButton?.addEventListener("click", () => {
    updateArtwork(currentArtwork - 1);
  });

  nextButton?.addEventListener("click", () => {
    updateArtwork(currentArtwork + 1);
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("show")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      updateArtwork(currentArtwork - 1);
    }

    if (event.key === "ArrowRight") {
      updateArtwork(currentArtwork + 1);
    }
  });

  // Swipe through images on touchscreens
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox?.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    },
    { passive: true }
  );

  lightbox?.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.screenX - touchStartX;
      const deltaY = touch.screenY - touchStartY;

      if (
        Math.abs(deltaX) > 50 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        updateArtwork(currentArtwork + (deltaX < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  // ==========================================
  // 5. ENGLISH / RUSSIAN LANGUAGE SWITCH
  // ==========================================

  const languageButton = document.querySelector("#langToggle");

  const translations = {
    en: {
      nav: ["HOME", "PRICES", "SAMPLES", "TOS", "ORDER ✦"],

      homeEyebrow: "ILLUSTRATOR ✦ CHARACTER DESIGN",
      description:
        "Digital artist creating colorful characters, expressive illustrations and little worlds full of warmth.",
      commissions: "COMMISSIONS OPEN",
      viewPrices: "VIEW COMMISSIONS",
      scroll: "SCROLL ↓",

      pricesEyebrow: "✦ COMMISSIONS ✦",
      pricesTitle: "Let's make<br><em>something beautiful.</em>",
      priceNames: ["LINEART", "LINEART + COLOR", "FULL RENDER"],
      priceRows: ["Shoulders", "Waist-up", "Full body"],

      extras: [
        [
          "➕ EXTRAS",
          "Second character: +100%",
          "Complex design / extra details: from +300 ₸",
          "Rush order: +30–50%"
        ],
        ["⏳ DEADLINE", "1–3 weeks"],
        ["⚠️ PAYMENT", "50% upfront", "Kaspi / Halyk / Freedom"]
      ],

      galleryEyebrow: "✦ SAMPLES ✦",
      galleryTitle: "My <em>works</em>",
      galleryHint: "Made with a cappuccino and a chocolate bar ♡",
      dragHint: "← DRAG / SWIPE →",

      tosEyebrow: "✦ PLEASE READ ✦",
      tosTitle: "Terms of<br><em>service.</em>",

      rules: [
        [
          "01 · WHAT I DON'T DRAW",
          "18+/NSFW, gore, complex furry, mechanics, landscapes, architecture or realism."
        ],
        [
          "02 · ORDER & PAYMENT",
          "50% upfront. The idea, references, format and estimated deadline are agreed on before payment."
        ],
        [
          "03 · EDITS",
          "Please request major edits during the sketch stage. Significant changes after approval may cost extra."
        ],
        [
          "04 · DEADLINE",
          "The usual turnaround is 1–3 weeks. Rush orders may include a +30–50% fee."
        ],
        [
          "05 · COLLABS & TRADES",
          "Collabs and art trades are open ♡"
        ]
      ],

      contactEyebrow: "✦ CONTACT ✦",
      contactTitle: "Want to order<br><em>an illustration?</em>",
      contactDescription:
        "Message me, attach references and tell me what you would like ♡",
      contactDetails: "ORDERS: @justAuri · SAMPLES: @hihihahaboo",
      socialsTitle: "✦ FIND ME ELSEWHERE ✦",
      socials: ["TELEGRAM", "TIKTOK", "INSTAGRAM", "X / TWITTER"],
      footer: "MADE WITH ✦"
    },

    ru: {
      nav: ["ГЛАВНАЯ", "ЦЕНЫ", "РАБОТЫ", "ПРАВИЛА", "ЗАКАЗ ✦"],

      homeEyebrow: "ИЛЛЮСТРАТОР ✦ ДИЗАЙН ПЕРСОНАЖЕЙ",
      description:
        "Цифровой художник, создающий ярких персонажей, выразительные иллюстрации и маленькие миры, наполненные теплом.",
      commissions: "ЗАКАЗЫ ОТКРЫТЫ",
      viewPrices: "ПОСМОТРЕТЬ ЦЕНЫ",
      scroll: "ЛИСТАЙ ↓",

      pricesEyebrow: "✦ ЗАКАЗЫ ✦",
      pricesTitle: "Давай создадим<br><em>что-то прекрасное.</em>",
      priceNames: ["ЛАЙН", "ЛАЙН + ПОКРАС", "ФУЛЛ"],
      priceRows: ["По плечи", "По пояс", "В полный рост"],

      extras: [
        [
          "➕ ДОПЛАТЫ",
          "Второй персонаж: +100%",
          "Сложный дизайн / дополнительные детали: от +300 ₸",
          "Срочность: +30–50%"
        ],
        ["⏳ СРОК", "1–3 недели"],
        ["⚠️ ОПЛАТА", "Предоплата 50%", "Kaspi / Halyk / Freedom"]
      ],

      galleryEyebrow: "✦ ПРИМЕРЫ РАБОТ ✦",
      galleryTitle: "Мои <em>работы</em>",
      galleryHint: "Создано с капучино и шоколадкой ♡",
      dragHint: "← ПЕРЕТАСКИВАЙ / ЛИСТАЙ →",

      tosEyebrow: "✦ ОБЯЗАТЕЛЬНО ПРОЧИТАЙ ✦",
      tosTitle: "Условия<br><em>заказа.</em>",

      rules: [
        [
          "01 · ЧТО Я НЕ РИСУЮ",
          "18+/NSFW, жестокость и кровь, сложный фурри, механику, пейзажи, архитектуру и реализм."
        ],
        [
          "02 · ЗАКАЗ И ОПЛАТА",
          "Предоплата 50%. До оплаты согласовываются идея, референсы, формат и примерный срок."
        ],
        [
          "03 · ПРАВКИ",
          "Основные правки лучше сообщать на этапе эскиза. Большие изменения после утверждения могут оплачиваться отдельно."
        ],
        [
          "04 · СРОКИ",
          "Обычный срок выполнения — 1–3 недели. Срочные заказы могут иметь доплату +30–50%."
        ],
        [
          "05 · КОЛЛАБЫ И ТРЕЙДЫ",
          "Коллабы/трейды открыты ♡"
        ]
      ],

      contactEyebrow: "✦ КОНТАКТЫ ✦",
      contactTitle: "Хочешь заказать<br><em>иллюстрацию?</em>",
      contactDescription:
        "Напиши мне, приложи референсы и расскажи, что хочешь получить ♡",
      contactDetails: "ЗАКАЗЫ: @justAuri · ПРИМЕРЫ: @hihihahaboo",
      socialsTitle: "✦ МОИ СОЦСЕТИ ✦",
      socials: ["ТЕЛЕГРАМ", "ТИКТОК", "ИНСТАГРАМ", "X / ТВИТТЕР"],
      footer: "СДЕЛАНО С ✦"
    }
  };

  function setLanguage(language) {
    const lang = translations[language] ? language : "en";
    const text = translations[lang];

    document.documentElement.lang = lang;

    // Navigation
    navigationLinks.forEach((link, index) => {
      if (text.nav[index]) {
        link.textContent = text.nav[index];
      }
    });

    // Home
    const homeEyebrow = document.querySelector(".hero-text .eyebrow");
    const description = document.querySelector(".hero .lead");
    const commissions = document.querySelector(".hero .open");
    const viewButton = document.querySelector(".hero .button");
    const scrollText = document.querySelector(".hero .scroll");

    if (homeEyebrow) homeEyebrow.textContent = text.homeEyebrow;
    if (description) description.textContent = text.description;

    if (commissions) {
      commissions.innerHTML = "<b></b> " + text.commissions;
    }

    if (viewButton) {
      viewButton.innerHTML = `${text.viewPrices} <strong>↘</strong>`;
    }

    if (scrollText) scrollText.textContent = text.scroll;

    // Prices
    const priceEyebrow = document.querySelector(".prices .eyebrow");
    const priceTitle = document.querySelector(".prices .title h2");

    if (priceEyebrow) priceEyebrow.textContent = text.pricesEyebrow;
    if (priceTitle) priceTitle.innerHTML = text.pricesTitle;

    document.querySelectorAll(".price-card").forEach((card, index) => {
      const heading = card.querySelector("h3");

      if (heading && text.priceNames[index]) {
        heading.textContent = text.priceNames[index];
      }

      card.querySelectorAll(".row span").forEach((span, rowIndex) => {
        if (text.priceRows[rowIndex]) {
          span.textContent = text.priceRows[rowIndex];
        }
      });
    });

    document.querySelectorAll(".extras > div").forEach((block, index) => {
      const values = text.extras[index];

      if (!values) return;

      Array.from(block.children).forEach((element, childIndex) => {
        if (values[childIndex] !== undefined) {
          element.textContent = values[childIndex];
        }
      });
    });

    // Gallery
    const galleryEyebrow = document.querySelector(".gallery-title .eyebrow");
    const galleryTitle = document.querySelector(".gallery-title h2");
    const galleryHint = document.querySelector(".gallery-hint");
    const dragHint = document.querySelector(".gallery-title > p");

    if (galleryEyebrow) galleryEyebrow.textContent = text.galleryEyebrow;
    if (galleryTitle) galleryTitle.innerHTML = text.galleryTitle;
    if (galleryHint) galleryHint.textContent = text.galleryHint;
    if (dragHint) dragHint.textContent = text.dragHint;

    // Terms of service
    const tosEyebrow = document.querySelector(".tos .eyebrow");
    const tosTitle = document.querySelector(".tos .title h2");

    if (tosEyebrow) tosEyebrow.textContent = text.tosEyebrow;
    if (tosTitle) tosTitle.innerHTML = text.tosTitle;

    document.querySelectorAll(".rules details").forEach((detail, index) => {
      const rule = text.rules[index];
      const summary = detail.querySelector("summary");
      const paragraph = detail.querySelector("p");

      if (!rule) return;

      if (summary) summary.textContent = rule[0];
      if (paragraph) paragraph.textContent = rule[1];
    });

    // Contact
    const contactEyebrow = document.querySelector(".contact > .eyebrow");
    const contactTitle = document.querySelector(".contact h2");
    const contactDescription = document.querySelector(
      ".contact > p:not(.eyebrow)"
    );
    const contactDetails = document.querySelector(".contacts");
    const socialsTitle = document.querySelector(".socials .eyebrow");
    const footerText = document.querySelector("footer span");

    if (contactEyebrow) contactEyebrow.textContent = text.contactEyebrow;
    if (contactTitle) contactTitle.innerHTML = text.contactTitle;

    if (contactDescription) {
      contactDescription.textContent = text.contactDescription;
    }

    if (contactDetails) contactDetails.textContent = text.contactDetails;
    if (socialsTitle) socialsTitle.textContent = text.socialsTitle;
    if (footerText) footerText.textContent = text.footer;

    document.querySelectorAll(".socials a").forEach((link, index) => {
      const arrow = link.querySelector("b");
      const label = text.socials[index];

      if (label) {
        // Update only the text node so the arrow remains intact.
        const textNode = Array.from(link.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE
        );

        if (textNode) {
          textNode.textContent = label + " ";
        } else {
          link.insertBefore(document.createTextNode(label + " "), link.firstChild);
        }
      }

      if (arrow) arrow.textContent = "↗";
    });

    // Language button
    if (languageButton) {
      languageButton.textContent = lang === "en" ? "RU" : "EN";
      languageButton.setAttribute(
        "aria-label",
        lang === "en" ? "Переключить на русский" : "Switch to English"
      );
    }

    // Save language preference
    try {
      localStorage.setItem("auri-language", lang);
    } catch (error) {
      console.warn("Language preference could not be saved.");
    }
  }

  // Restore saved language
  let savedLanguage = "en";

  try {
    savedLanguage = localStorage.getItem("auri-language") || "en";
  } catch (error) {
    // English is used if localStorage is unavailable.
  }

  setLanguage(savedLanguage);

  languageButton?.addEventListener("click", () => {
    const nextLanguage =
      document.documentElement.lang === "en" ? "ru" : "en";

    setLanguage(nextLanguage);
  });
});
