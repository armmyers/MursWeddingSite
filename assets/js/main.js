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
  const PASSWORD = "chabella!"; // case-sensitive
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
// June 6, 2026
const weddingDate = new Date("2026-06-06T00:00:00");

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

/* ---------------------------
   Party-based RSVP logic
--------------------------- */

// 1. Define your parties here.
// You can add more objects to this array.
// For each party:
// - partyName: how you think of the group (usually the main last name)
// - members: each person with firstName, lastName, and optional aliases
const PARTIES = [
  {
    id: "vu",
    partyName: "Vu",
    members: [
      {
        firstName: "Theresa",
        lastName: "Vu",
        aliases: ["vu"],
      },
      {
        firstName: "Vivek",
        lastName: "Rajeevan",
        aliases: ["rajeevan", "rajivan", "rajee van"],
      },
    ],
  },
  // TODO: Add more parties in this format
  // {
  //   id: "smith",
  //   partyName: "Smith",
  //   members: [
  //     { firstName: "Alex", lastName: "Smith", aliases: ["smith"] },
  //     { firstName: "Jamie", lastName: "Smith", aliases: ["smith"] },
  //   ],
  // },
];

// Utility: normalize strings for matching
function normalizeName(str) {
  return (str || "").toString().trim().toLowerCase();
}

// Find party given a last name (case-insensitive)
function findPartyByLastName(lastName) {
  const target = normalizeName(lastName);
  if (!target) return null;

  for (const party of PARTIES) {
    // match partyName itself
    if (normalizeName(party.partyName) === target) return party;

    for (const member of party.members) {
      if (normalizeName(member.lastName) === target) return party;
      if (Array.isArray(member.aliases)) {
        for (const alias of member.aliases) {
          if (normalizeName(alias) === target) return party;
        }
      }
    }
  }
  return null;
}

// Build the party rows inside the form
function renderPartyMembers(party, container) {
  container.innerHTML = "";

  party.members.forEach((member, index) => {
    const row = document.createElement("div");
    row.className = "guest-row";

    // main column (name + attending checkbox)
    const mainCol = document.createElement("div");
    mainCol.className = "guest-main";

    const attendingId = `guest-${party.id}-${index}-attending`;
    const attendingInput = document.createElement("input");
    attendingInput.type = "checkbox";
    attendingInput.id = attendingId;
    attendingInput.name = `guest_${index}_attendingSaturday`;
    attendingInput.value = "yes";

    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = attendingId;
    nameLabel.className = "guest-name-label";
    nameLabel.textContent = `${member.firstName} ${member.lastName}`;

    // Hidden field to store name
    const hiddenName = document.createElement("input");
    hiddenName.type = "hidden";
    hiddenName.name = `guest_${index}_name`;
    hiddenName.value = `${member.firstName} ${member.lastName}`;

    mainCol.appendChild(attendingInput);
    mainCol.appendChild(nameLabel);
    mainCol.appendChild(hiddenName);

    // options column (Friday + dietary)
    const optionsCol = document.createElement("div");
    optionsCol.className = "guest-options";

    const fridayLabel = document.createElement("label");
    const fridayInput = document.createElement("input");
    fridayInput.type = "checkbox";
    fridayInput.name = `guest_${index}_friday`;
    fridayInput.value = "yes";
    fridayLabel.appendChild(fridayInput);
    fridayLabel.appendChild(
      document.createTextNode("Coming to Friday welcome party?")
    );

    const dietaryInput = document.createElement("input");
    dietaryInput.type = "text";
    dietaryInput.name = `guest_${index}_dietary`;
    dietaryInput.placeholder = "Dietary needs / allergies (optional)";
    dietaryInput.className = "guest-dietary";

    optionsCol.appendChild(fridayLabel);
    optionsCol.appendChild(dietaryInput);

    row.appendChild(mainCol);
    row.appendChild(optionsCol);

    container.appendChild(row);
  });
}

// Glue everything together on the page
(function initRsvp() {
  const lookupInput = document.getElementById("lookup-last");
  const lookupButton = document.getElementById("lookup-button");
  const lookupMessage = document.getElementById("lookup-message");

  const partyStep = document.getElementById("party-rsvp-step");
  const soloStep = document.getElementById("solo-rsvp-step");

  const partyHeading = document.getElementById("party-heading");
  const partyMembersContainer = document.getElementById("party-members-container");
  const fieldLookupLast = document.getElementById("field-lookup-last");
  const fieldPartyName = document.getElementById("field-party-name");

  if (!lookupInput || !lookupButton || !lookupMessage) return;

  function showParty(party, lastNameEntered) {
    if (!partyStep || !partyMembersContainer) return;

    partyHeading.textContent = `We found your party: The ${party.partyName} party. Please let us know who’s coming and share any details for each guest.`;
    fieldLookupLast.value = lastNameEntered;
    fieldPartyName.value = party.partyName;

    renderPartyMembers(party, partyMembersContainer);

    partyStep.classList.add("active");
    if (soloStep) soloStep.classList.remove("active");

    lookupMessage.textContent =
      "If this doesn’t look right, you can refresh the page or scroll down to RSVP as an individual guest.";
  }

  function showSoloFallback(lastNameEntered) {
    if (soloStep) {
      soloStep.classList.add("active");
    }
    if (partyStep) {
      partyStep.classList.remove("active");
    }
    lookupMessage.textContent =
      "We couldn’t find that last name in our list, but you can RSVP as an individual guest below. If you think this is a mistake, feel free to reach out to us!";
    // Optionally pre-fill last name in solo name field
    const soloName = document.getElementById("solo-name");
    if (soloName && lastNameEntered) {
      // only fill if field is empty
      if (!soloName.value) {
        soloName.value = lastNameEntered + " ";
      }
    }
  }

  function handleLookup() {
    const last = lookupInput.value;
    if (!last.trim()) {
      lookupMessage.textContent = "Please enter a last name to look up your party.";
      return;
    }

    const party = findPartyByLastName(last);
    if (party) {
      showParty(party, last.trim());
    } else {
      showSoloFallback(last.trim());
    }
  }

  lookupButton.addEventListener("click", handleLookup);
  lookupInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  });
})();