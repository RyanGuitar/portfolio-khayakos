import { initialiseContactLinks } from "./contact-links.js";
import { initialiseNavigation } from "./navigation.js";
import { initialisePhoneDemo } from "./phone-demo.js?v=20260724-19";

const mobileSectionQuery = window.matchMedia("(max-width: 880px)");
let orientationLockTimer;

function lockMobileSectionHeight() {
  if (!mobileSectionQuery.matches) {
    document.documentElement.style.removeProperty("--mobile-section-height");
    return;
  }

  const nav = document.querySelector(".nav");
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const navHeight = nav?.getBoundingClientRect().height || 76;
  const sectionHeight = Math.max(1, Math.round(viewportHeight - navHeight));

  document.documentElement.style.setProperty("--mobile-section-height", `${sectionHeight}px`);
}

function scheduleOrientationLock() {
  window.clearTimeout(orientationLockTimer);
  orientationLockTimer = window.setTimeout(lockMobileSectionHeight, 450);
}

lockMobileSectionHeight();
mobileSectionQuery.addEventListener("change", lockMobileSectionHeight);
window.addEventListener("orientationchange", scheduleOrientationLock, { passive: true });
window.screen.orientation?.addEventListener("change", scheduleOrientationLock);

initialiseContactLinks();
initialiseNavigation();
initialisePhoneDemo();
