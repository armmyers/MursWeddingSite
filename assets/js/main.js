// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

// Smooth-ish scrolling offset for sticky header
const header = document.querySelector(".site-header");
if (header) {
  const headerHeight = header.offsetHeight;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        const offset = rect.top + window.pageYOffset - (headerHeight + 10);
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  });
}

// Countdown (set to your exact wedding date)
const countdownEl = document.getElementById("countdown");
// Change this to your actual date (YYYY-MM-DD)
const weddingDate = new Date("2026-05-24T00:00:00");

function updateCountdown() {
  if (!countdownEl) return;
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "We're married!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  countdownEl.textContent = `${months} months and ${remainingDays} days to go`;
}

updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60); // update hourly

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}