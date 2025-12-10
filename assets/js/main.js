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
      if (errorEl) {
        errorEl.textContent = "Incorrect password. Please try again.";
      }
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

// ---------- RSVP PARTY LOOKUP LOGIC ----------

// Helper: normalize strings for matching last names
function normalizeName(str) {
  return (str || "").toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Guest list.
 * - first: first name (or description)
 * - last: last name (may be empty for some; we’ll fall back to party name)
 * - party: canonical party name (normally the family last name)
 * - group: sub-party for families with the same last name (1, 2, …)
 */
const GUESTS = [
  { first: "Tracy", last: "Collins", party: "Collins", group: 3 },
  { first: "Jimmy", last: "Collins", party: "Collins", group: 3 },
  { first: "Gaelen", last: "Collins", party: "Collins", group: 3 },
  { first: "Alice", last: "Myers", party: "Myers", group: 1 },
  { first: "Dave", last: "Myers", party: "Myers", group: 1 },
  { first: "Mary", last: "Collins", party: "Collins", group: 1 },
  { first: "Seamus", last: "Collins", party: "Collins", group: 1 },
  { first: "Gerard", last: "Collins", party: "Collins", group: 2 },
  { first: "Mary", last: "Keane", party: "Collins", group: 2 },

  { first: "Cynthia", last: "Amelar", party: "Amelar", group: 1 },
  { first: "Katie", last: "Hines", party: "Hines", group: 1 },
  { first: "Theresa", last: "Vu", party: "Vu", group: 1 },
  { first: "Vivek", last: "Rajeevan", party: "Vu", group: 1 },
  { first: "Melissa", last: "Cohen", party: "Cohen", group: 1 },
  { first: "Max", last: "Smeader", party: "Smeader", group: 1 },
  { first: "Chloe", last: "Smeader", party: "Cohen", group: 1 },

  { first: "Kimberle", last: "Hickey", party: "Hickey", group: 1 },
  { first: "Michael", last: "Hickey", party: "Hickey", group: 1 },
  { first: "Debbie", last: "Levy", party: "Levy", group: 1 },
  { first: "Effie", last: "Levy", party: "Levy", group: 1 },
  { first: "Adharsh", last: "Ganesan", party: "Ganesan", group: 1 },
  { first: "Abhinaya", last: "Ganesan", party: "Ganesan", group: 1 },
  { first: "Stephen", last: "Phillips", party: "Phillips", group: 1 },
  { first: "Jackie", last: "Phillips", party: "Phillips", group: 1 },
  { first: "Haley", last: "Payne", party: "Payne", group: 1 },
  { first: "Stone", last: "Payne", party: "Payne", group: 1 },
  { first: "Mary", last: "Meberg", party: "Meberg", group: 1 },
  { first: "Krister", last: "Meberg", party: "Meberg", group: 1 },
  { first: "Sahitya", last: "Maranganti", party: "Maranganti", group: 1 },
  { first: "Gustavo", last: "", party: "Maranganti", group: 1 },
  { first: "Sandeep", last: "Sainath", party: "Sainath", group: 1 },
  { first: "Nayara", last: "", party: "Sainath", group: 1 },
  { first: "Kunal", last: "Kuldeep", party: "Kuldeep", group: 1 },
  { first: "Micah", last: "Kuldeep", party: "Kuldeep", group: 1 },
  { first: "Alex", last: "Zhao", party: "Zhao", group: 1 },
  { first: "Lisa", last: "Zhao", party: "Zhao", group: 1 },
  { first: "Satya", last: "Godavarthi", party: "Godavarthi", group: 1 },
  { first: "Plus One", last: "Godavarthi", party: "Godavarthi", group: 1 },
  { first: "Sandy", last: "Backerman", party: "Backerman", group: 1 },
  { first: "David", last: "Backerman", party: "Backerman", group: 1 },
  { first: "Lynda", last: "Kreitzer", party: "Kreitzer", group: 1 },
  { first: "Phil", last: "Kreitzer", party: "Kreitzer", group: 1 },
  { first: "Robert", last: "Mulligan", party: "Mulligan", group: 1 },
  { first: "Victoria", last: "Mulligan", party: "Mulligan", group: 1 },
  { first: "Mary Alice", last: "Walshe", party: "Walshe", group: 1 },
  { first: "Bri", last: "Sime", party: "Sime", group: 1 },
  { first: "Adam", last: "Sime", party: "Sime", group: 1 },
  { first: "Ed", last: "Pajaziti", party: "Pajaziti", group: 1 },
  { first: "Lily", last: "Pajaziti", party: "Pajaziti", group: 1 },
  { first: "John", last: "Kenney", party: "Kenney", group: 1 },
  { first: "Kathleen", last: "Kenney", party: "Kenney", group: 1 },
  { first: "John", last: "Carruba", party: "Carruba", group: 1 },
  { first: "Samantha", last: "Carruba", party: "Carruba", group: 1 },
  { first: "Brandon", last: "Rohrbaugh", party: "Rohrbaugh", group: 1 },
  { first: "Jess", last: "Rohrbaugh", party: "Rohrbaugh", group: 1 },
  { first: "Rosemary", last: "Kenney", party: "Kenney", group: 1 },
  { first: "Heidi", last: "Studer", party: "Studer", group: 1 },
  { first: "Sarah", last: "Childs", party: "Childs", group: 1 },
  { first: "Matt", last: "Golino", party: "Golino", group: 1 },
  { first: "Plus One", last: "Golino", party: "Golino", group: 1 },
  { first: "Stephen", last: "Haley", party: "Haley", group: 1 },
  { first: "Ryan", last: "Burke", party: "Burke", group: 1 },
  { first: "Ellette", last: "Burke", party: "Burke", group: 1 },
  { first: "Mitchell", last: "Jones", party: "Jones", group: 1 },
  { first: "Briana", last: "Jones", party: "Jones", group: 1 },
  { first: "Jon", last: "Cordova", party: "Cordova", group: 1 },
  { first: "Anna", last: "Cordova", party: "Cordova", group: 1 },
  { first: "Jodi", last: "Hochman", party: "Hochman", group: 1 },
  { first: "Hooch", last: "Hochman", party: "Hochman", group: 1 },
  { first: "Jude", last: "Nifong", party: "Nifong", group: 1 },
  { first: "Smashy", last: "Ashcraft", party: "Ashcraft", group: 1 },
  { first: "Allie", last: "Ashcraft", party: "Ashcraft", group: 1 },
  { first: "Dutra", last: "Dutra", party: "Dutra", group: 1 },
  { first: "Brittney", last: "Dutra", party: "Dutra", group: 1 },
  { first: "Ness", last: "Tucker", party: "Tucker", group: 1 },
  { first: "Will", last: "Tucker", party: "Tucker", group: 1 },
  { first: "Joe", last: "Brown", party: "Brown", group: 1 },
  { first: "Meena", last: "Brown", party: "Brown", group: 1 },
  { first: "Ralph", last: "Kimbell", party: "Kimbell", group: 1 },
  { first: "Ashley", last: "Killebrew", party: "Killebrew", group: 1 },
  { first: "Jaye", last: "", party: "Killebrew", group: 1 },
  { first: "Hillary", last: "Lloyd", party: "Lloyd", group: 1 },
  { first: "Luther", last: "Lloyd", party: "Lloyd", group: 1 },
  { first: "Tati", last: "Boyd", party: "Boyd", group: 1 },
  { first: "Jeff", last: "Boyd", party: "Boyd", group: 1 },
  { first: "Takis", last: "Chronis", party: "Chronis", group: 1 },
  { first: "Plus One", last: "Chronis", party: "Chronis", group: 1 },
  { first: "Sayan", last: "Roy", party: "Roy", group: 1 },
  { first: "Shreya", last: "Roy", party: "Roy", group: 1 },
  { first: "Alex", last: "Brumfield", party: "Brumfield", group: 1 },
  { first: "Amelie", last: "Brumfield", party: "Brumfield", group: 1 },

  { first: "Jimmy", last: "Filiakis", party: "Filiakis", group: 1 },
  { first: "Kate", last: "Filiakis", party: "Filiakis", group: 1 },
  { first: "Daniel", last: "Green", party: "Green", group: 1 },
  { first: "Brian", last: "Swanson", party: "Swanson", group: 1 },
  { first: "Emily", last: "Swanson", party: "Swanson", group: 1 },
  { first: "Nicholas", last: "McGilvary", party: "McGilvary", group: 1 },
  { first: "Claire", last: "McGilvary", party: "McGilvary", group: 1 },
  { first: "Jacob", last: "David", party: "David", group: 1 },
  { first: "Thomas", last: "Pettet", party: "Pettet", group: 1 },
  { first: "Plus One", last: "Pettet", party: "Pettet", group: 1 },
  { first: "Chris", last: "Jre...(truncated 1438 characters)...", group: 1 },
  { first: "Bernice", last: "Bienenfeld", party: "Bienenfeld", group: 1 },
  { first: "Madeline", last: "Murray", party: "Murray", group: 1 },
  { first: "John", last: "Murray", party: "Murray", group: 1 },
  { first: "Tod", last: "Rubin", party: "Rubin", group: 1 },
  { first: "Leslie", last: "Rubin", party: "Rubin", group: 1 },
  { first: "Manuel", last: "Medina", party: "Medina", group: 1 },
  { first: "Sue", last: "Medina", party: "Medina", group: 1 },
  { first: "Shari", last: "", party: "", group: 1 },
  { first: "Steve", last: "", party: "", group: 1 },
  { first: "Kim", last: "Costigan", party: "Costigan", group: 1 },
  { first: "Mike", last: "Costigan", party: "Costigan", group: 1 },
];

// Build a map keyed by "party::group"
const PARTY_MAP = (() => {
  const map = new Map();
  GUESTS.forEach((g, index) => {
    const partyKey = g.party || g.last || "Unknown";
    const group = g.group || 1;
    const key = `${partyKey}::${group}`;
    if (!map.has(key)) {
      map.set(key, { party: partyKey, group, guests: [] });
    }
    map.get(key).guests.push({ ...g, index });
  });
  return map;
})();

function findPartyGroupsByLastName(lastName) {
  const target = normalizeName(lastName);
  const results = [];
  PARTY_MAP.forEach((partyObj) => {
    const hasMatch = partyObj.guests.some((g) => {
      const searchLast = g.last && g.last.trim() ? g.last : g.party;
      return normalizeName(searchLast) === target;
    });
    if (hasMatch) results.push(partyObj);
  });
  return results;
}

function setupRSVPPartyLookup() {
  const lastNameInput = document.getElementById("last-name-lookup");
  const lookupBtn = document.getElementById("lookup-button");
  const messageEl = document.getElementById("lookup-message");
  const partyChoiceContainer = document.getElementById("party-choice-container");
  const partyChoiceSelect = document.getElementById("party-choice");
  const guestsContainer = document.getElementById("party-guests-container");
  const partyExtraContainer = document.getElementById("party-extra-container");
  const manualContainer = document.getElementById("simple-rsvp-container");
  const manualToggle = document.getElementById("manual-rsvp-toggle");

  const hiddenParty = document.getElementById("selected-party");
  const hiddenGroup = document.getElementById("selected-group");
  const hiddenMode = document.getElementById("lookup-mode");
  const hiddenLast = document.getElementById("lookup-last-name");

  // be tolerant: match by name or by data-netlify form
  const form =
    document.querySelector('form[name="rsvp"]') ||
    document.querySelector('form[data-netlify="true"]');

  if (!lastNameInput || !lookupBtn || !guestsContainer) return;

  function clearGuests() {
    guestsContainer.innerHTML = "";
    guestsContainer.classList.add("hidden");
    if (partyExtraContainer) partyExtraContainer.classList.add("hidden");
  }

  function renderGuestsForParty(partyObj) {
    if (!partyObj) return;
    clearGuests();

    guestsContainer.classList.remove("hidden");
    if (partyExtraContainer) partyExtraContainer.classList.remove("hidden");

    if (hiddenParty) hiddenParty.value = partyObj.party;
    if (hiddenGroup) hiddenGroup.value = String(partyObj.group);
    if (hiddenMode) hiddenMode.value = "party";

    partyObj.guests.forEach((guest, idx) => {
      const fullName = [guest.first, guest.last].filter(Boolean).join(" ");
      const isPlusOne = /plus one/i.test(guest.first || "");
      const guestIndex = `${guest.party}_${guest.group}_${idx}`;

      const nameFieldHtml = isPlusOne
        ? `<input type="text" class="guest-name-input" placeholder="Your plus one" />`
        : `<span class="guest-name-label">${fullName}</span>
           <input type="hidden" class="guest-name-input" value="${fullName}" />`;

      const rowHtml = `
        <div class="form-field guest-row" data-plus-one="${isPlusOne ? "true" : "false"}">
          <div class="guest-name-cell">
            ${nameFieldHtml}
          </div>
          <div class="guest-checkboxes">
            <label class="inline-label">
              <input
                type="checkbox"
                class="guest-attending"
                value="yes"
              />
              Attending Saturday
            </label>
            <label class="inline-label">
              <input
                type="checkbox"
                class="guest-friday"
                value="yes"
              />
              Friday welcome party
            </label>
          </div>
        </div>
      `;
      guestsContainer.insertAdjacentHTML("beforeend", rowHtml);
    });
  }

  function showManualOnly() {
    clearGuests();
    if (partyChoiceContainer) partyChoiceContainer.classList.add("hidden");
    if (manualContainer) manualContainer.classList.remove("hidden");
    if (hiddenMode) hiddenMode.value = "manual";
    if (messageEl) {
      messageEl.textContent =
        "We couldn’t find that last name. Please RSVP below and we’ll match you on our side.";
    }
  }

  function handleLookup() {
    const last = lastNameInput.value.trim();
    if (!last) {
      if (messageEl) messageEl.textContent = "Please type a last name to search.";
      return;
    }

    if (hiddenLast) hiddenLast.value = last;

    const matches = findPartyGroupsByLastName(last);

    clearGuests();
    if (partyChoiceContainer) partyChoiceContainer.classList.add("hidden");
    if (partyChoiceSelect) partyChoiceSelect.innerHTML = "";
    if (manualContainer) manualContainer.classList.add("hidden");

    if (!matches.length) {
      showManualOnly();
      return;
    }

    if (messageEl) {
      messageEl.textContent =
        matches.length === 1
          ? `We found your party: ${matches[0].party}. Please confirm who’s coming below.`
          : "We found more than one party with that last name. Please choose which one is yours.";
    }

    if (matches.length === 1) {
      renderGuestsForParty(matches[0]);
      return;
    }

    // Multiple sub-parties
    if (partyChoiceContainer && partyChoiceSelect) {
      partyChoiceContainer.classList.remove("hidden");

      matches.forEach((partyObj, idx) => {
        const namesPreview = partyObj.guests
          .map((g) => (g.first || "").split(" ")[0])
          .slice(0, 3)
          .join(" / ");
        const option = document.createElement("option");
        option.value = `${partyObj.party}::${partyObj.group}`;
        option.textContent = `${partyObj.party} party #${partyObj.group} – ${namesPreview}`;
        if (idx === 0) option.selected = true;
        partyChoiceSelect.appendChild(option);
      });

      const updateFromSelect = () => {
        const value = partyChoiceSelect.value;
        const [partyName, groupStr] = value.split("::");
        const key = `${partyName}::${groupStr}`;
        const partyObj = PARTY_MAP.get(key);
        if (partyObj) renderGuestsForParty(partyObj);
      };

      partyChoiceSelect.addEventListener("change", updateFromSelect);
      updateFromSelect();
    }
  }

  lookupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleLookup();
  });

  lastNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  });

  if (manualToggle) {
    manualToggle.addEventListener("click", (e) => {
      e.preventDefault();
      if (!manualContainer) return;
      const isHidden = manualContainer.classList.contains("hidden");
      manualContainer.classList.toggle("hidden", !isHidden ? true : false);
      if (hiddenMode) hiddenMode.value = isHidden ? "manual" : "party";
    });
  }

  // ---- Custom submit logic to create one Netlify form submission per guest ----
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const isPartyMode = !guestsContainer.classList.contains("hidden");
      const isManualMode = !manualContainer.classList.contains("hidden");

      if (!isPartyMode && !isManualMode) {
        alert("Please fill out the form.");
        return;
      }

      const unableAttendEl = document.getElementById("party-unable-attend");
      const unable = unableAttendEl ? unableAttendEl.checked : false;

      const sharedData = {
        selected_party: hiddenParty ? hiddenParty.value : "",
        selected_group: hiddenGroup ? hiddenGroup.value : "",
        lookup_mode: hiddenMode ? hiddenMode.value : "",
        lookup_last_name: hiddenLast ? hiddenLast.value : "",
        party_email: document.getElementById("party-email") ? document.getElementById("party-email").value : "",
        hotel_interest: document.getElementById("hotel-interest") ? document.getElementById("hotel-interest").value : "",
        party_unable_attend: unable ? "yes" : "",
        party_dietary: document.getElementById("party-dietary") ? document.getElementById("party-dietary").value : "",
        party_notes: document.getElementById("party-notes") ? document.getElementById("party-notes").value : "",
      };

      const submissions = [];

      if (isPartyMode) {
        const rows = guestsContainer.querySelectorAll(".guest-row");
        rows.forEach((row) => {
          const nameInput = row.querySelector(".guest-name-input");
          const name = nameInput ? nameInput.value.trim() : "";
          if (!name) return; // Skip empty names

          const attendingCheckbox = row.querySelector(".guest-attending");
          const fridayCheckbox = row.querySelector(".guest-friday");

          const attending = unable ? "no" : (attendingCheckbox && attendingCheckbox.checked ? "yes" : "no");
          const friday = unable ? "no" : (fridayCheckbox && fridayCheckbox.checked ? "yes" : "no");

          submissions.push({
            guest_name: name,
            guest_attending: attending,
            guest_friday: friday,
            ...sharedData
          });
        });
      } else if (isManualMode) {
        const manualName = document.getElementById("manual-name") ? document.getElementById("manual-name").value.trim() : "";
        if (!manualName) {
          alert("Please enter your name.");
          return;
        }

        const manualAttending = document.getElementById("manual-attending") ? document.getElementById("manual-attending").value : "";
        const manualFriday = document.getElementById("manual-friday") ? document.getElementById("manual-friday").value : "";
        const manualDietary = document.getElementById("manual-dietary") ? document.getElementById("manual-dietary").value : "";
        const manualNotes = document.getElementById("manual-notes") ? document.getElementById("manual-notes").value : "";
        const manualEmail = document.getElementById("manual-email") ? document.getElementById("manual-email").value : "";

        const attending = manualAttending === "accepts" ? "yes" : "no";
        let friday = manualFriday === "yes" ? "yes" : "no";
        if (manualFriday === "maybe") friday = "maybe";

        submissions.push({
          guest_name: manualName,
          guest_attending: attending,
          guest_friday: friday,
          party_email: manualEmail,
          hotel_interest: "", // No field in manual
          party_unable_attend: "",
          party_dietary: manualDietary,
          party_notes: manualNotes,
          selected_party: "Manual",
          selected_group: "",
          lookup_mode: "manual",
          lookup_last_name: lastNameInput ? lastNameInput.value.trim() : "",
        });
      }

      if (submissions.length === 0) {
        alert("No valid guests to RSVP for.");
        return;
      }

      try {
        const promises = submissions.map((sub) => {
          const formData = new FormData();
          formData.append("form-name", "rsvp");
          formData.append("bot-field", ""); // Honeypot
          for (const [key, value] of Object.entries(sub)) {
            formData.append(key, value);
          }
          return fetch(location.pathname, {
            method: "POST",
            body: formData,
          });
        });

        await Promise.all(promises);
        // Show success (add this element after the form in HTML if needed)
        const successEl = document.getElementById("rsvp-success");
        if (successEl) successEl.classList.remove("hidden");
        form.style.display = "none";
        alert("RSVP submitted successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        alert("There was an error submitting your RSVP. Please try again.");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", setupRSVPPartyLookup);