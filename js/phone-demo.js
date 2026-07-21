document.addEventListener("DOMContentLoaded", () => {
  const phoneALikeBtn = document.querySelector("#phoneA-like-btn");
  const phoneALikeCount = document.querySelector(
    "#phoneA-like-btn .like-count",
  );
  const toastA = document.querySelector("#toast-a");

  const phoneBLikeCount = document.querySelector(
    "#phoneB-like-btn .like-count",
  );
  const phoneBScreen = document.querySelector("#phoneBScreen");
  const toastBText = document.querySelector("#toast-b-text");

  const replayBtn = document.querySelector("#replay-btn");

  let count = 0;
  let isAnimating = false;

  function triggerLikeDemo() {
    if (isAnimating) return;
    isAnimating = true;

    count++;

    // 1. Phone A Actions: Change state, update count, trigger button heart burst
    phoneALikeBtn.classList.add("liked");
    phoneALikeCount.textContent = count;
    createButtonHeartBurst(phoneALikeBtn);

    if (toastA) {
      toastA.style.opacity = "1";
    }

    // 2. Phone B Actions: Count increments (heart button remains neutral), trigger left heart stream
    setTimeout(() => {
      phoneBLikeCount.textContent = count;
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

      setTimeout(() => heart.remove(), 650);
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

        setTimeout(() => heart.remove(), 1800);
      }, i * 200);
    }
  }

  // Reset Demo Functionality
  function resetDemo() {
    count = 0;
    isAnimating = false;

    phoneALikeBtn.classList.remove("liked");
    phoneALikeCount.textContent = "0";

    phoneBLikeCount.textContent = "0";
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
