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

// ----- Simple password gate ----- //
(function () {
    const PASSWORD = "Vannah"; // case-sensitive
    const overlay = document.getElementById("gate-overlay");
    const pwInput = document.getElementById("gate-password");
    const submitBtn = document.getElementById("gate-submit");
    const errorEl = document.getElementById("gate-error");
  
    if (!overlay || !pwInput || !submitBtn) return;
  
    // If already unlocked in this browser, skip gate
    const unlocked = window.localStorage.getItem("wedding_site_unlocked");
    if (unlocked === "true") {
      overlay.style.display = "none";
      return;
    }
  
    function checkPassword() {
      if (pwInput.value === PASSWORD) {
        overlay.style.display = "none";
        window.localStorage.setItem("wedding_site_unlocked", "true");
      } else {
        errorEl.textContent = "Incorrect password. Please try again.";
        pwInput.value = "";
        pwInput.focus();
      }
    }
  
    submitBtn.addEventListener("click", checkPassword);
    pwInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkPassword();
      }
    });
  })();
  

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