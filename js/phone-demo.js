document.addEventListener("DOMContentLoaded", () => {
  // Grab all elements carefully
  const phoneALikeBtn = document.getElementById("phoneA-like-btn");
  const phoneBLikeBtn = document.getElementById("phoneB-like-btn");
  const phoneBScreen = document.getElementById("phoneBScreen");
  const replayBtn = document.getElementById("replay-btn");
  const toastA = document.getElementById("toast-a");
  const toastBText = document.getElementById("toast-b-text");

  let count = 0;
  let isAnimating = false;

  function triggerLikeDemo() {
    if (isAnimating || !phoneALikeBtn || !phoneBLikeBtn || !phoneBScreen)
      return;
    isAnimating = true;

    count++;

    // 1. Phone A Actions: Change state, update count, trigger button heart burst
    phoneALikeBtn.classList.add("liked");
    const phoneACountEl = phoneALikeBtn.querySelector(".like-count");
    if (phoneACountEl) phoneACountEl.textContent = count;

    createButtonHeartBurst(phoneALikeBtn);

    if (toastA) {
      toastA.style.opacity = "1";
    }

    // 2. Phone B Actions: Sync live after slight delay
    setTimeout(() => {
      const phoneBCountEl = phoneBLikeBtn.querySelector(".like-count");
      if (phoneBCountEl) phoneBCountEl.textContent = count;

      if (toastBText) {
        toastBText.textContent = `${count} ${count === 1 ? "like" : "likes"} · updated live`;
      }

      spawnHeartStream(phoneBScreen);

      setTimeout(() => {
        isAnimating = false;
      }, 1800);
    }, 350);
  }

  // Generate little popping hearts surrounding Phone A's button
  function createButtonHeartBurst(buttonElement) {
    const burstCount = 4;
    const offsets = [
      { x: "-24px", y: "-22px" },
      { x: "24px", y: "-22px" },
      { x: "-28px", y: "12px" },
      { x: "28px", y: "12px" },
    ];

    for (let i = 0; i < burstCount; i++) {
      const heart = document.createElement("span");
      heart.classList.add("button-heart-burst");
      heart.innerHTML = "❤️";
      heart.style.setProperty("--tx", offsets[i].x);
      heart.style.setProperty("--ty", offsets[i].y);

      buttonElement.appendChild(heart);

      setTimeout(() => {
        if (heart.parentNode) heart.remove();
      }, 650);
    }
  }

  // Generate a vertical stream of floating hearts up the left side of Phone B
  function spawnHeartStream(container) {
    const streamCount = 5;

    for (let i = 0; i < streamCount; i++) {
      setTimeout(() => {
        const heart = document.createElement("span");
        heart.classList.add("floating-heart");
        heart.innerHTML = "❤️";

        // Add slight random offset along the left margin
        const randomX = Math.floor(Math.random() * 14);
        heart.style.left = `${12 + randomX}px`;

        container.appendChild(heart);

        setTimeout(() => {
          if (heart.parentNode) heart.remove();
        }, 1800);
      }, i * 200);
    }
  }

  // Reset Demo Functionality
  function resetDemo() {
    count = 0;
    isAnimating = false;

    if (phoneALikeBtn) {
      phoneALikeBtn.classList.remove("liked");
      const phoneACountEl = phoneALikeBtn.querySelector(".like-count");
      if (phoneACountEl) phoneACountEl.textContent = "0";
    }

    if (phoneBLikeBtn) {
      const phoneBCountEl = phoneBLikeBtn.querySelector(".like-count");
      if (phoneBCountEl) phoneBCountEl.textContent = "0";
    }

    if (toastBText) {
      toastBText.textContent = "0 likes · updated live";
    }

    // Clear active animations
    document
      .querySelectorAll(".button-heart-burst, .floating-heart")
      .forEach((el) => el.remove());
  }

  // Event Listeners
  if (phoneALikeBtn) {
    phoneALikeBtn.addEventListener("click", triggerLikeDemo);
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", resetDemo);
  }
});
