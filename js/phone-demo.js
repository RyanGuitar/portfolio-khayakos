const CONFETTI_COLOURS = ["#d99a2b", "#a63a2e", "#4f7a3d", "#2f6f73", "#70486f", "#f7f2e6"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DEMO_DURATIONS = {
  photo: 15000,
  product: 10200,
  likes: 4000,
  market: 5500,
};

function getRoles(root) {
  return [...root.querySelectorAll("[data-role]")].reduce((roles, element) => {
    const key = element.dataset.role.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    roles[key] = element;
    return roles;
  }, {});
}

function schedule(timers, delay, callback) {
  timers.push(window.setTimeout(callback, delay));
}

function setStatus(roles, message) {
  if (roles.status) roles.status.textContent = message;
}

function setHidden(element, hidden) {
  element.hidden = hidden;
}

function replaceList(list, items) {
  list.replaceChildren(...items.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function spawnHearts(root, anchor, count = 5, spreadMs = 75) {
  if (reducedMotion) return;
  const rootRect = root.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const startX = anchorRect.left - rootRect.left + anchorRect.width / 2;
  const startY = anchorRect.top - rootRect.top + 4;

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "khaya-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "❤";
    heart.style.left = `${startX + (Math.random() * 30 - 15)}px`;
    heart.style.top = `${startY + (Math.random() * 8 - 4)}px`;
    heart.style.setProperty("--heart-delay", `${index * spreadMs}ms`);
    heart.style.setProperty("--heart-x", `${Math.random() * 40 - 20}px`);
    root.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1550 + index * spreadMs);
  }
}

function celebrateMarketOpen(root) {
  if (reducedMotion) return;
  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "demo-confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.setProperty("--confetti-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--confetti-colour", CONFETTI_COLOURS[index % CONFETTI_COLOURS.length]);
    piece.style.setProperty("--confetti-delay", `${Math.random() * .65}s`);
    piece.style.setProperty("--confetti-duration", `${2.6 + Math.random() * 1.7}s`);
    piece.style.setProperty("--confetti-drift", `${Math.random() * 150 - 75}px`);
    piece.style.setProperty("--confetti-turn", `${360 + Math.random() * 720}deg`);
    root.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5000);
  }
}

function resetPhoto(root, roles) {
  root.classList.remove("is-complete");
  roles.changePhoto.classList.remove("is-tapped");
  roles.choosePhoto.classList.remove("is-tapped");
  roles.usePhoto.classList.remove("is-tapped");
  roles.exitEdit.classList.remove("is-tapped");
  roles.zoomLevel.classList.remove("is-zooming");
  roles.cropImage.classList.remove("is-positioned");
  setHidden(roles.photoSheet, true);
  setHidden(roles.cropModal, true);
  setHidden(roles.ownerMobile, false);
  setHidden(roles.ownerFinishedView, true);
  setHidden(roles.ownerImage, true);
  setHidden(roles.ownerPlaceholder, false);
  roles.ownerPriceField.value = "0";
  roles.ownerNameField.value = "New Item";
  roles.ownerDescriptionField.value = "Add a short description here.";
  roles.ownerPriceField.classList.remove("is-typing");
  roles.ownerNameField.classList.remove("is-typing");
  roles.ownerDescriptionField.classList.remove("is-typing");
  setHidden(roles.visitorImage, true);
  setHidden(roles.visitorPlaceholder, false);
  roles.visitorName.textContent = "New Item";
  roles.visitorDescription.textContent = "Product details will appear here.";
  roles.visitorPrice.textContent = "R0";
  roles.visitorCard.classList.remove("is-live-updated", "is-receiving", "has-photo", "has-name", "has-price", "has-description");
  roles.visitorLabel.textContent = "Visitor’s phone";
  roles.visitorLabel.classList.remove("is-updated");
  roles.ownerLabel.textContent = "Owner edit mode";
  roles.ownerLabel.classList.remove("is-updated");
  setStatus(roles, "A blank New Item card is ready in owner edit mode.");
}

function updateVisitor(roles, label) {
  roles.visitorCard.classList.add("is-receiving");
  roles.visitorLabel.textContent = label;
  roles.visitorLabel.classList.add("is-updated");
}

function typeField(timers, field, text, startAt, duration) {
  const step = Math.max(35, duration / text.length);
  schedule(timers, startAt, () => {
    field.value = "";
    field.classList.add("is-typing");
  });
  [...text].forEach((character, index) => {
    schedule(timers, startAt + (index + 1) * step, () => {
      field.value += character;
    });
  });
  schedule(timers, startAt + duration + 120, () => field.classList.remove("is-typing"));
}

function finishPhoto(root, roles) {
  setHidden(roles.ownerImage, false);
  setHidden(roles.ownerPlaceholder, true);
  roles.ownerPriceField.value = "200";
  roles.ownerNameField.value = "Moist Chocolate Cake";
  roles.ownerDescriptionField.value = "Rich, moist chocolate cake layered with silky chocolate icing.";
  setHidden(roles.visitorPlaceholder, true);
  setHidden(roles.visitorImage, false);
  roles.visitorName.textContent = "Moist Chocolate Cake";
  roles.visitorPrice.textContent = "R200";
  roles.visitorDescription.textContent = "Rich, moist chocolate cake layered with silky chocolate icing.";
  roles.visitorCard.classList.add("has-photo", "has-name", "has-price", "has-description", "is-live-updated");
  roles.visitorLabel.textContent = "Complete and live";
  roles.visitorLabel.classList.add("is-updated");
  setHidden(roles.ownerMobile, true);
  setHidden(roles.ownerFinishedView, false);
  roles.ownerLabel.textContent = "Visitor view";
  roles.ownerLabel.classList.add("is-updated");
  root.classList.add("is-complete");
  setStatus(roles, "The complete Moist Chocolate Cake listing is now live.");
}

function playPhoto(root, roles, timers) {
  resetPhoto(root, roles);
  if (reducedMotion) {
    finishPhoto(root, roles);
    return;
  }
  schedule(timers, 800, () => {
    roles.changePhoto.classList.add("is-tapped");
    setStatus(roles, "The owner starts by adding the product photo.");
  });
  schedule(timers, 1450, () => {
    setHidden(roles.photoSheet, false);
    setStatus(roles, "The phone offers the camera or photo library.");
  });
  schedule(timers, 2350, () => {
    roles.choosePhoto.classList.add("is-tapped");
    setStatus(roles, "Moist Chocolate Cake is selected from the photo library.");
  });
  schedule(timers, 3050, () => {
    setHidden(roles.photoSheet, true);
    setHidden(roles.cropModal, false);
    setStatus(roles, "The real Khaya Kos crop editor opens.");
  });
  schedule(timers, 4350, () => {
    roles.zoomLevel.classList.add("is-zooming");
    roles.cropImage.classList.add("is-positioned");
    setStatus(roles, "The owner zooms and centres the cake inside the square.");
  });
  schedule(timers, 5850, () => {
    roles.usePhoto.classList.add("is-tapped");
    setStatus(roles, "The owner taps “Use this photo”.");
  });
  schedule(timers, 6500, () => {
    setHidden(roles.cropModal, true);
    setHidden(roles.ownerImage, false);
    setHidden(roles.ownerPlaceholder, true);
    setHidden(roles.visitorPlaceholder, true);
    setHidden(roles.visitorImage, false);
    roles.visitorCard.classList.add("has-photo");
    updateVisitor(roles, "Photo updated live");
    setStatus(roles, "The exact cropped photo immediately appears for the visitor.");
  });

  typeField(timers, roles.ownerPriceField, "200", 7350, 650);
  schedule(timers, 7350, () => setStatus(roles, "The owner enters the R200 price."));
  schedule(timers, 8150, () => {
    roles.visitorPrice.textContent = "R200";
    roles.visitorCard.classList.add("has-price");
    updateVisitor(roles, "Price updated live");
    setStatus(roles, "Moving to the next field publishes R200 for the visitor.");
  });
  typeField(timers, roles.ownerNameField, "Moist Chocolate Cake", 8350, 1500);
  schedule(timers, 8350, () => setStatus(roles, "The owner types the product name."));
  schedule(timers, 10000, () => {
    roles.visitorName.textContent = "Moist Chocolate Cake";
    roles.visitorCard.classList.add("has-name");
    updateVisitor(roles, "Name updated live");
    setStatus(roles, "Leaving the name field publishes Moist Chocolate Cake.");
  });
  typeField(timers, roles.ownerDescriptionField, "Rich, moist chocolate cake layered with silky chocolate icing.", 10150, 2200);
  schedule(timers, 10150, () => setStatus(roles, "The owner adds a short description."));
  schedule(timers, 12500, () => {
    roles.visitorDescription.textContent = "Rich, moist chocolate cake layered with silky chocolate icing.";
    roles.visitorCard.classList.add("has-description", "is-live-updated");
    updateVisitor(roles, "Description updated live");
    setStatus(roles, "The finished description appears on the visitor’s phone.");
  });

  schedule(timers, 13600, () => {
    roles.exitEdit.classList.add("is-tapped");
    setStatus(roles, "Every edit is already live. The owner now exits edit mode.");
  });
  schedule(timers, 14350, () => {
    setHidden(roles.ownerMobile, true);
    setHidden(roles.ownerFinishedView, false);
    roles.ownerLabel.textContent = "Visitor view";
    roles.ownerLabel.classList.add("is-updated");
    roles.visitorLabel.textContent = "Complete and live";
    roles.visitorLabel.classList.add("is-updated");
    root.classList.add("is-complete");
    setStatus(roles, "Both phones now show the same finished customer view.");
  });
}

function resetProduct(root, roles) {
  root.classList.remove("is-complete");
  roles.ownerStock.textContent = "5";
  roles.visitorStock.textContent = "5 left";
  roles.ownerMinus.classList.remove("is-tapped");
  roles.productOwnerCard.classList.remove("is-sold-out");
  roles.visitorProductCard.classList.remove("is-sold-out", "is-live-updated");
  roles.ownerSoldStamp.classList.remove("is-visible");
  roles.visitorSoldStamp.classList.remove("is-visible");
  roles.productVisitorLabel.textContent = "Visitor’s phone";
  roles.productVisitorLabel.classList.remove("is-updated");
  roles.productOwnerLabel.textContent = "Owner edit mode";
  setHidden(roles.salesToast, true);
  roles.salesToast.classList.remove("is-sold-out");
  setStatus(roles, "The market is open with 5 Strawberry Cupcakes left.");
}

function updateStockLabel(roles, label) {
  roles.ownerMinus.classList.remove("is-tapped");
  void roles.ownerMinus.offsetWidth;
  roles.ownerMinus.classList.add("is-tapped");
  roles.productVisitorLabel.textContent = label;
  roles.productVisitorLabel.classList.add("is-updated");
}

function setProductStock(roles, amount) {
  roles.ownerStock.textContent = String(amount);
  roles.visitorStock.textContent = amount === 0 ? "Sold out" : `${amount} left`;
  if (amount === 0) {
    roles.productOwnerCard.classList.add("is-sold-out");
    roles.visitorProductCard.classList.add("is-sold-out", "is-live-updated");
    roles.ownerSoldStamp.classList.add("is-visible");
    roles.visitorSoldStamp.classList.add("is-visible");
  }
}

function showSalesToast(roles, message, soldOut = false) {
  roles.salesToast.textContent = message;
  roles.salesToast.classList.toggle("is-sold-out", soldOut);
  setHidden(roles.salesToast, false);
}

function playProduct(root, roles, timers) {
  resetProduct(root, roles);
  if (reducedMotion) {
    setProductStock(roles, 0);
    showSalesToast(roles, "🧁 Strawberry Cupcakes are sold out!", true);
    roles.productVisitorLabel.textContent = "Sold out live";
    roles.productVisitorLabel.classList.add("is-updated");
    root.classList.add("is-complete");
    return;
  }

  schedule(timers, 1100, () => {
    setProductStock(roles, 4);
    updateStockLabel(roles, "4 left · updated live");
    setStatus(roles, "First sale recorded: 4 cupcakes remain on both phones.");
  });
  schedule(timers, 2050, () => {
    setProductStock(roles, 3);
    updateStockLabel(roles, "3 left · updated live");
    setStatus(roles, "Second sale recorded: the visitor immediately sees 3 left.");
  });
  schedule(timers, 3000, () => {
    setProductStock(roles, 2);
    updateStockLabel(roles, "2 left · updated live");
    setStatus(roles, "The third minus tap updates the live stock to 2.");
  });
  schedule(timers, 3550, () => {
    showSalesToast(roles, "🧁 3 × Strawberry Cupcakes just sold at the market!");
    setStatus(roles, "Visitors are told that 3 Strawberry Cupcakes just sold.");
  });
  schedule(timers, 5850, () => setHidden(roles.salesToast, true));
  schedule(timers, 6600, () => {
    setProductStock(roles, 1);
    updateStockLabel(roles, "1 left · updated live");
    setStatus(roles, "Another sale leaves only 1 Strawberry Cupcake.");
  });
  schedule(timers, 7700, () => {
    setProductStock(roles, 0);
    updateStockLabel(roles, "Sold out live");
    showSalesToast(roles, "🧁 Strawberry Cupcakes are sold out!", true);
    root.classList.add("is-complete");
    setStatus(roles, "The final sale triggers Sold Out on both devices in real time.");
  });
  schedule(timers, 10000, () => setHidden(roles.salesToast, true));
}

function resetLikes(root, roles) {
  root.querySelectorAll(".khaya-heart").forEach((heart) => heart.remove());
  roles.primaryLikeButton.classList.remove("is-liked");
  roles.primaryLikeIcon.textContent = "♡";
  roles.primaryLikeCount.textContent = "0";
  roles.secondaryLikeButton.classList.remove("is-liked", "is-receiving");
  roles.secondaryLikeIcon.textContent = "♡";
  roles.secondaryLikeCount.textContent = "0";
  roles.primaryLikeLabel.textContent = "Visitor taps Like";
  roles.primaryLikeLabel.classList.remove("is-updated");
  roles.secondaryLikeLabel.textContent = "Another visitor";
  roles.secondaryLikeLabel.classList.remove("is-updated");
  setStatus(roles, "The Khaya Kos heart is ready for a visitor.");
}

function updateRemoteLike(roles) {
  roles.secondaryLikeButton.classList.remove("is-receiving");
  void roles.secondaryLikeButton.offsetWidth;
  roles.secondaryLikeButton.classList.add("is-receiving");
  roles.secondaryLikeLabel.textContent = "1 like · updated live";
  roles.secondaryLikeLabel.classList.add("is-updated");
}

function playLikes(root, roles, timers) {
  resetLikes(root, roles);

  const tapLike = () => {
    roles.primaryLikeButton.classList.add("is-liked");
    roles.primaryLikeIcon.textContent = "❤";
    roles.primaryLikeCount.textContent = "1";
    roles.primaryLikeLabel.textContent = "Like sent";
    roles.primaryLikeLabel.classList.add("is-updated");
    spawnHearts(root, roles.primaryLikeButton, 4);
    setStatus(roles, "The visitor taps the heart — it fills red and the count updates.");
  };
  const receiveLike = () => {
    roles.secondaryLikeCount.textContent = "1";
    updateRemoteLike(roles);
    spawnHearts(root, roles.remoteHeartOrigin, 7, 120);
    setStatus(roles, "Another visitor sees the count update instantly, with a stream of hearts.");
  };

  if (reducedMotion) {
    tapLike();
    receiveLike();
    return;
  }

  schedule(timers, 1200, tapLike);
  schedule(timers, 2200, receiveLike);
}

function resetMarket(root, roles) {
  root.querySelectorAll(".demo-confetti").forEach((piece) => piece.remove());
  roles.marketToggle.classList.remove("is-opening", "is-open");
  roles.marketToggleTitle.textContent = "Market closed";
  roles.marketToggleDetail.textContent = "Tap to open";
  setHidden(roles.menuView, false);
  setHidden(roles.marketView, true);
  setStatus(roles, "Visitors are browsing the regular weekly menu.");
}

function playMarket(root, roles, timers) {
  resetMarket(root, roles);
  const openMarket = () => {
    roles.marketToggle.classList.remove("is-opening");
    roles.marketToggle.classList.add("is-open");
    roles.marketToggleTitle.textContent = "Market open";
    roles.marketToggleDetail.textContent = "Live at Gazebo Valley";
    setHidden(roles.menuView, true);
    setHidden(roles.marketView, false);
    celebrateMarketOpen(root);
    setStatus(roles, "Connected visitors enter the live market under the confetti.");
  };
  if (reducedMotion) {
    openMarket();
    return;
  }
  schedule(timers, 1200, () => {
    roles.marketToggle.classList.add("is-opening");
    setStatus(roles, "The owner taps “Market closed”.");
  });
  schedule(timers, 2300, openMarket);
}

function createChapterController(root) {
  const roles = getRoles(root);
  const demoName = root.dataset.demoChapter;
  let timers = [];
  let state = "idle";

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  }

  function play() {
    clearTimers();
    state = "running";
    root.dataset.demoState = state;
    root.classList.add("is-paused");
    root.classList.remove("is-in-view");
    if (demoName === "photo") playPhoto(root, roles, timers);
    if (demoName === "product") playProduct(root, roles, timers);
    if (demoName === "likes") playLikes(root, roles, timers);
    if (demoName === "market") playMarket(root, roles, timers);
    void root.offsetWidth;
    root.classList.remove("is-paused");
    void root.offsetWidth;
    root.classList.add("is-in-view");

    if (reducedMotion) {
      state = "completed";
      root.dataset.demoState = state;
      return;
    }

    schedule(timers, DEMO_DURATIONS[demoName], () => {
      state = "completed";
      root.dataset.demoState = state;
      timers = [];
    });
  }

  function stop() {
    if (state !== "running") return;
    clearTimers();
    state = "interrupted";
    root.dataset.demoState = state;
    root.classList.add("is-paused");
    root.querySelectorAll(".demo-confetti, .khaya-heart").forEach((element) => element.remove());
  }

  roles.replay.addEventListener("click", play);
  root.dataset.demoState = state;
  return {
    play,
    stop,
    get isRunning() { return state === "running"; },
    get isCompleted() { return state === "completed"; },
    get shouldAutoPlay() { return state === "idle" || state === "interrupted"; },
  };
}

export function initialisePhoneDemo() {
  const chapters = [...document.querySelectorAll("[data-demo-chapter]")];
  if (!chapters.length) return;

  const controllers = new Map(chapters.map((chapter) => [chapter, createChapterController(chapter)]));
  if (reducedMotion) {
    controllers.forEach((controller) => controller.play());
    return;
  }

  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  const snapSections = [hero, ...chapters].filter(Boolean);
  let scrollFrame;
  let unlockTimer;
  let wheelResetTimer;
  let isNavigating = false;
  let gestureLocked = false;
  let activeChapter = null;
  let lastScrollY = window.scrollY;
  let wheelDirection = 0;
  let wheelDistance = 0;
  let wheelGestureConsumed = false;
  let lastWheelAt = 0;
  let lastWheelMagnitude = 0;
  let fallbackDirection = 0;
  let fallbackDistance = 0;
  let touchStartY = null;

  const navHeight = () => nav?.getBoundingClientRect().height || 76;
  const sectionScrollTop = (section) => Math.max(
    0,
    Math.round(window.scrollY + section.getBoundingClientRect().top - navHeight()),
  );
  const isAligned = (section) => Math.abs(window.scrollY - sectionScrollTop(section)) <= 12;

  const activateChapter = (chapter) => {
    const controller = controllers.get(chapter);
    activeChapter = chapter;

    if (controller.shouldAutoPlay) {
      controller.play();
      return;
    }
    chapter.classList.remove("is-paused");
    chapter.classList.add("is-in-view");
  };

  const pauseRunningAnimations = () => {
    controllers.forEach((controller) => controller.stop());
  };

  const targetForDirection = (direction) => {
    const currentScroll = window.scrollY;
    const tolerance = 12;
    if (direction > 0) {
      return snapSections.find((section) => sectionScrollTop(section) > currentScroll + tolerance) || null;
    }
    return [...snapSections].reverse().find(
      (section) => sectionScrollTop(section) < currentScroll - tolerance,
    ) || null;
  };

  const resetInputIntent = () => {
    wheelDirection = 0;
    wheelDistance = 0;
    fallbackDirection = 0;
    fallbackDistance = 0;
  };

  const releaseGestureAfterPause = () => {
    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(() => {
      gestureLocked = false;
      fallbackDirection = 0;
      fallbackDistance = 0;
    }, 180);
  };

  const finishNavigation = (target, destination) => {
    window.scrollTo(0, destination);
    isNavigating = false;
    lastScrollY = window.scrollY;
    fallbackDirection = 0;
    fallbackDistance = 0;

    if (controllers.has(target)) activateChapter(target);
    else activeChapter = null;

    releaseGestureAfterPause();
  };

  const navigateTo = (target) => {
    if (!target || isNavigating || gestureLocked) return false;

    const destination = sectionScrollTop(target);
    const start = window.scrollY;
    const distance = destination - start;
    if (Math.abs(distance) <= 2) {
      finishNavigation(target, destination);
      return true;
    }

    isNavigating = true;
    gestureLocked = true;
    pauseRunningAnimations();
    chapters.forEach((chapter) => chapter.classList.remove("is-in-view"));

    const duration = Math.min(560, Math.max(380, Math.abs(distance) * .55));
    let startedAt;
    const easeOutQuart = (progress) => 1 - ((1 - progress) ** 4);

    const step = (timestamp) => {
      if (startedAt === undefined) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      window.scrollTo(0, start + distance * easeOutQuart(progress));
      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step);
        return;
      }
      finishNavigation(target, destination);
    };

    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(step);
    return true;
  };

  const navigateInDirection = (direction) => navigateTo(targetForDirection(direction));

  window.addEventListener("wheel", (event) => {
    const direction = Math.sign(event.deltaY);
    if (!direction) return;

    const now = performance.now();
    const magnitude = Math.abs(event.deltaY);
    const startedAfterPause = now - lastWheelAt > 140;
    const renewedImpulse = wheelGestureConsumed
      && !isNavigating
      && !gestureLocked
      && direction === wheelDirection
      && magnitude >= 6
      && magnitude > lastWheelMagnitude * 1.8;

    if (startedAfterPause || renewedImpulse || direction !== wheelDirection) {
      wheelGestureConsumed = false;
      wheelDistance = 0;
    }

    lastWheelAt = now;
    lastWheelMagnitude = magnitude;
    wheelDirection = direction;

    window.clearTimeout(wheelResetTimer);
    wheelResetTimer = window.setTimeout(() => {
      wheelDirection = 0;
      wheelDistance = 0;
      wheelGestureConsumed = false;
      lastWheelMagnitude = 0;
    }, 140);

    pauseRunningAnimations();
    const target = targetForDirection(direction);
    if (!target) return;

    event.preventDefault();

    if (isNavigating || gestureLocked || wheelGestureConsumed) return;

    wheelDistance += magnitude;
    if (wheelDistance >= 10 && navigateTo(target)) wheelGestureConsumed = true;
  }, { passive: false });

  window.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1 || isNavigating) return;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (touchStartY === null || event.touches.length !== 1) return;

    const delta = touchStartY - event.touches[0].clientY;
    const direction = Math.sign(delta);
    if (!direction) return;

    pauseRunningAnimations();
    const target = targetForDirection(direction);
    if (!target) return;

    event.preventDefault();
    if (isNavigating || gestureLocked) return;
    if (Math.abs(delta) >= 10 && navigateTo(target)) touchStartY = null;
  }, { passive: false });

  const clearTouch = () => {
    touchStartY = null;
  };
  window.addEventListener("touchend", clearTouch, { passive: true });
  window.addEventListener("touchcancel", clearTouch, { passive: true });

  window.addEventListener("keydown", (event) => {
    const interactiveTarget = event.target.closest?.("button, input, textarea, select, a");
    if (interactiveTarget) return;

    let direction = 0;
    if (["ArrowDown", "PageDown"].includes(event.key) || (event.key === " " && !event.shiftKey)) direction = 1;
    if (["ArrowUp", "PageUp"].includes(event.key) || (event.key === " " && event.shiftKey)) direction = -1;
    if (!direction || !targetForDirection(direction)) return;

    event.preventDefault();
    navigateInDirection(direction);
  });

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    if (isNavigating || gestureLocked || Math.abs(delta) < 1) return;

    const alignedChapter = chapters.find((chapter) => isAligned(chapter));
    if (alignedChapter) {
      resetInputIntent();
      if (alignedChapter !== activeChapter || !alignedChapter.classList.contains("is-in-view")) {
        activateChapter(alignedChapter);
      }
      return;
    }

    pauseRunningAnimations();
    const direction = Math.sign(delta);
    if (direction !== fallbackDirection) {
      fallbackDirection = direction;
      fallbackDistance = 0;
    }
    fallbackDistance += Math.abs(delta);
    if (fallbackDistance >= 10) navigateInDirection(direction);
  }, { passive: true });

  window.visualViewport?.addEventListener("resize", () => {
    lastScrollY = window.scrollY;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseRunningAnimations();
    }
  });

  const initiallyAlignedChapter = chapters.find((chapter) => isAligned(chapter));
  if (initiallyAlignedChapter) activateChapter(initiallyAlignedChapter);
}
