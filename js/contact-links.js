import { CONTACT } from "./config.js";

export function initialiseContactLinks() {
  const encodedMessage = encodeURIComponent(CONTACT.whatsappMessage);
  const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodedMessage}`;

  document.querySelectorAll(".wa-link").forEach((link) => {
    link.href = whatsappUrl;
  });
}
