// assets/js/main.js - COMPLETE FIXED VERSION WITH PROPER NETLIFY SUBMISSIONS

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") navLinks.classList.remove("open");
  });
}

// Password gate
(function () {
  const PASSWORD = "chabella!";
  const overlay = document.getElementById("gate-overlay");
  const pwInput = document.getElementById("gate-password");
  const submitBtn = document.getElementById("gate-submit");
  const errorEl = document.getElementById("gate-error");

  if (!overlay || !pwInput || !submitBtn) return;
  if (localStorage.getItem("wedding_site_unlocked") === "true") {
    overlay.style.display = "none";
    return;
  }

  const check = () => {
    if (pwInput.value === PASSWORD) {
      overlay.style.display = "none";
      localStorage.setItem("wedding_site_unlocked", "true");
    } else {
      errorEl.textContent = "Incorrect password. Please try again.";
      pwInput.value = "";
    }
  };
  submitBtn.addEventListener("click", check);
  pwInput.addEventListener("keydown", (e) => e.key === "Enter" && check());
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" });
    }
  });
});

// Countdown
const countdownEl = document.getElementById("countdown");
if (countdownEl) {
  const weddingDate = new Date("2026-06-06T00:00:00");
  const update = () => {
    const diff = weddingDate - new Date();
    if (diff <= 0) return countdownEl.textContent = "We're married!";
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    countdownEl.textContent = `${months} months and ${days % 30} days to go`;
  };
  update();
  setInterval(update, 3600000);
}
document.getElementById("year").textContent = new Date().getFullYear();

// ==================== RSVP LOGIC (FIXED FOR COMPLETE NETLIFY DATA) ====================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvp-form");
  const lastNameInput = document.getElementById("last-name-lookup");
  const lookupBtn = document.getElementById("lookup-button");
  const guestsContainer = document.getElementById("party-guests-container");
  const partyExtraContainer = document.getElementById("party-extra-container");
  const partyChoiceContainer = document.getElementById("party-choice-container");
  const partyChoiceSelect = document.getElementById("party-choice");
  const manualContainer = document.getElementById("simple-rsvp-container");
  const messageEl = document.getElementById("lookup-message");
  const successEl = document.getElementById("rsvp-success");

  const hiddenParty = document.getElementById("selected-party");
  const hiddenGroup = document.getElementById("selected-group");
  const hiddenMode = document.getElementById("lookup-mode");
  const hiddenLast = document.getElementById("lookup-last-name");

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
    { first: "Krister", last: "", party: "Meberg", group: 1 },
    { first: "Sahitya", last: "Maranganti", party: "Maranganti", group: 1 },
    { first: "Gustavo", last: "", party: "Maranganti", group: 1 },
    { first: "Sandeep", last: "Sainath", party: "Sainath", group: 1 },
    { first: "Nayara", last: "Paudyal", party: "Sainath", group: 1 },
    { first: "Alex", last: "Zhao", party: "Zhao", group: 1 },
    { first: "Lisa", last: "Zhao", party: "Zhao", group: 1 },
    { first: "Sandy", last: "Backerman", party: "Backerman", group: 1 },
    { first: "David", last: "Backerman", party: "Backerman", group: 1 },
    { first: "Lynda", last: "Kreitzer", party: "Kreitzer", group: 1 },
    { first: "Phil", last: "Kreitzer", party: "Kreitzer", group: 1 },
    { first: "Robert", last: "Mulligan", party: "Mulligan", group: 1 },
    { first: "Victoria", last: "Mulligan", party: "Mulligan", group: 1 },
    { first: "Mary Alice", last: "Walshe", party: "Walshe", group: 1 },
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
    { first: "Daniel", last: "Hochman", party: "Hochman", group: 1 },
    { first: "Jude", last: "Nifong", party: "Nifong", group: 1 },
    { first: "Matt", last: "Ashcraft", party: "Ashcraft", group: 1 },
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
    { first: "Chris", last: "Jreissati", party: "Jreissati", group: 1 },
    { first: "Lauren", last: "Jreissati", party: "Jreissati", group: 1 },
    { first: "Andrea", last: "Mayer", party: "Mayer", group: 1 },
    { first: "Colette", last: "Mayer", party: "Mayer", group: 1 },
    { first: "Mark", last: "Fishman", party: "Fishman", group: 1 },
    { first: "Sue", last: "Fishman", party: "Fishman", group: 1 },
    { first: "Maura", last: "Fishman", party: "Fishman", group: 1 },
    { first: "Brian", last: "Fishman", party: "Fishman", group: 1 },
    { first: "Randy", last: "Kirsch", party: "Kirsch", group: 1 },
    { first: "Ronnie", last: "Kirsch", party: "Kirsch", group: 1 },
    { first: "Marshall", last: "Kirsch", party: "Kirsch", group: 1 },
    { first: "David", last: "Cooper", party: "Cooper", group: 1 },
    { first: "Shelly", last: "Cooper", party: "Cooper", group: 1 },
    { first: "Eli", last: "Friedman", party: "Friedman", group: 1 },
    { first: "Melissa", last: "Friedman", party: "Friedman", group: 1 },
    { first: "Michael", last: "Yurowitz", party: "Yurowitz", group: 1 },
    { first: "Melanie", last: "Yurowitz", party: "Yurowitz", group: 1 },
    { first: "Jeff", last: "Yurowitz", party: "Yurowitz", group: 1 },
    { first: "Barbara", last: "Yurowitz", party: "Yurowitz", group: 1 },
    { first: "Rachel", last: "Yurowitz", party: "Yurowitz", group: 1 },
    { first: "Danielle", last: "Katz", party: "Katz", group: 1 },
    { first: "Sabrina", last: "Golumb", party: "Golumb", group: 1 },
    { first: "Jamie", last: "Golumb", party: "Golumb", group: 1 },
    { first: "Adam", last: "Katz", party: "Katz", group: 1 },
    { first: "Ashley", last: "Katz", party: "Katz", group: 1 },
    { first: "Brandon", last: "Heller", party: "Heller", group: 1 },
    { first: "Alex", last: "Heller", party: "Heller", group: 1 },
    { first: "Bill", last: "Bienenfeld", party: "Bienenfeld", group: 1 },
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
    { first: "Michael", last: "Costigan", party: "Costigan", group: 1 },
  ];

  // Build lookup maps
  const PARTY_MAP = new Map();
  const LASTNAME_MAP = new Map();

  GUESTS.forEach(g => {
    const key = `${g.party}::${g.group}`;
    if (!PARTY_MAP.has(key)) PARTY_MAP.set(key, { party: g.party, group: g.group, guests: [] });
    PARTY_MAP.get(key).guests.push(g);

    const normLast = normalize(g.last || g.party);
    if (!LASTNAME_MAP.has(normLast)) LASTNAME_MAP.set(normLast, []);
    LASTNAME_MAP.get(normLast).push(PARTY_MAP.get(key));
  });

  function normalize(str) {
    return (str || "").toLowerCase().replace(/[^a-z]/g, "");
  }

  function findPartyGroupsByLastName(name) {
    const norm = normalize(name);
    const seen = new Set();
    const result = [];
    LASTNAME_MAP.forEach((parties, key) => {
      if (key.includes(norm)) {
        parties.forEach(p => {
          const id = `${p.party}::${p.group}`;
          if (!seen.has(id)) {
            seen.add(id);
            result.push(p);
          }
        });
      }
    });
    return result;
  }

  function clearGuests() {
    guestsContainer.innerHTML = "";
    guestsContainer.classList.add("hidden");
    partyExtraContainer.classList.add("hidden");
  }

  function renderGuestsForParty(partyObj) {
    clearGuests();
    hiddenParty.value = partyObj.party;
    hiddenGroup.value = partyObj.group;

    partyObj.guests.forEach(g => {
      const fullName = g.first + (g.last ? " " + g.last : "");
      const row = document.createElement("div");
      row.className = "guest-row";
      row.innerHTML = `
        <div class="guest-name-cell">
          <input type="text" class="guest-name-input" value="${fullName}" readonly />
        </div>
        <div class="guest-checkboxes">
          <label class="inline-label">
            <input type="checkbox" class="guest-attending" checked /> Attending Saturday
          </label>
          <label class="inline-label">
            <input type="checkbox" class="guest-friday" /> Friday welcome party
          </label>
        </div>
      `;
      guestsContainer.appendChild(row);
    });

    guestsContainer.classList.remove("hidden");
    partyExtraContainer.classList.remove("hidden");
  }

  lookupBtn.addEventListener("click", () => {
    const last = lastNameInput.value.trim();
    if (!last) return messageEl.textContent = "Please enter a last name.";

    hiddenLast.value = last;
    const matches = findPartyGroupsByLastName(last);

    clearGuests();
    partyChoiceContainer.classList.add("hidden");
    partyChoiceSelect.innerHTML = "";
    manualContainer.classList.add("hidden");

    if (matches.length === 0) {
      manualContainer.classList.remove("hidden");
      messageEl.textContent = "Name not found — please use the manual form below.";
      hiddenMode.value = "manual";
      return;
    }

    if (matches.length === 1) {
      renderGuestsForParty(matches[0]);
      messageEl.textContent = `Found your party! Please confirm who's coming.`;
    } else {
      partyChoiceContainer.classList.remove("hidden");
      messageEl.textContent = "Multiple parties found — please select yours:";
      matches.forEach((p, i) => {
        const opt = new Option(`${p.party} party #${p.group} – ${p.guests.map(g=>g.first).join(" / ")}`, `${p.party}::${p.group}`);
        if (i===0) opt.selected = true;
        partyChoiceSelect.appendChild(opt);
      });
      partyChoiceSelect.onchange = () => {
        const [party, group] = partyChoiceSelect.value.split("::");
        const obj = Array.from(PARTY_MAP.values()).find(x => x.party === party && x.group == group);
        if (obj) renderGuestsForParty(obj);
      };
      renderGuestsForParty(matches[0]);
    }
  });

  // SUBMIT — ONE ROW PER GUEST WITH COMPLETE DATA TO NETLIFY
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const unableToAttend = document.getElementById("party-unable-attend").checked;

    // Collect party-level data that will be repeated for each guest
    const sharedData = {
      selected_party: hiddenParty.value || "",
      selected_group: hiddenGroup.value || "",
      lookup_mode: hiddenMode.value || "party",
      lookup_last_name: hiddenLast.value || "",
      party_email: document.getElementById("party-email")?.value || "",
      hotel_interest: document.getElementById("hotel-interest")?.value || "",
      party_unable_attend: unableToAttend ? "yes" : "no",
      party_dietary: document.getElementById("party-dietary")?.value || "",
      party_notes: document.getElementById("party-notes")?.value || "",
    };

    const allGuests = [];

    // Normal party mode - collect each guest's individual data
    if (!guestsContainer.classList.contains("hidden")) {
      document.querySelectorAll(".guest-row").forEach(row => {
        const name = row.querySelector(".guest-name-input").value.trim();
        if (!name) return;

        const attendingSat = row.querySelector(".guest-attending").checked;
        const attendingFri = row.querySelector(".guest-friday").checked;

        // Determine actual attendance based on "unable to attend" checkbox
        const satStatus = unableToAttend ? "no" : (attendingSat ? "yes" : "no");
        const friStatus = unableToAttend ? "no" : (attendingFri ? "yes" : "no");

        allGuests.push({
          guest_name: name,
          guest_attending_saturday: satStatus,
          guest_attending_friday: friStatus
        });
      });
    }
    // Manual mode - single guest submission
    else if (!manualContainer.classList.contains("hidden")) {
      const name = document.getElementById("manual-name").value.trim();
      if (!name) {
        alert("Please enter your name.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
      }
      const email = document.getElementById("manual-email").value.trim();
      if (!email) {
        alert("Please enter your email.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
      }
      
      const satStatus = document.getElementById("manual-attending").value === "accepts" ? "yes" : "no";
      const friStatus = document.getElementById("manual-friday").value === "yes" ? "yes" : "no";
      
      allGuests.push({
        guest_name: name,
        guest_attending_saturday: satStatus,
        guest_attending_friday: friStatus
      });
      
      // Override shared data for manual mode
      sharedData.party_email = email;
      sharedData.party_dietary = document.getElementById("manual-dietary").value || "";
      sharedData.party_notes = document.getElementById("manual-notes").value || "";
      sharedData.selected_party = "Manual Entry";
      sharedData.lookup_mode = "manual";
    }

    if (allGuests.length === 0) {
      alert("No guests found. Please fill out the form.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      return;
    }

    // Store all guest data as JSON in hidden field
    const allGuestsJson = document.getElementById("all-guests-json");
    allGuestsJson.value = JSON.stringify(allGuests);

    // Submit each guest sequentially (not in parallel to avoid rate limiting)
    try {
      for (let i = 0; i < allGuests.length; i++) {
        const guest = allGuests[i];
        submitBtn.textContent = `Submitting ${i + 1} of ${allGuests.length}...`;
        
        const formData = new FormData();
        formData.append("form-name", "rsvp");
        
        // Add guest-specific data
        formData.append("guest_name", guest.guest_name);
        formData.append("guest_attending_saturday", guest.guest_attending_saturday);
        formData.append("guest_attending_friday", guest.guest_attending_friday);
        
        // Add party-level shared data
        Object.entries(sharedData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        // Also include all guests JSON on each submission for backup
        formData.append("all_guests_json", allGuestsJson.value);
        
        const response = await fetch("/", { 
          method: "POST", 
          body: formData 
        });
        
        if (!response.ok) {
          throw new Error(`Submission failed for ${guest.guest_name}: ${response.status}`);
        }
        
        // Small delay between submissions to avoid rate limiting
        if (i < allGuests.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Show success message and hide form
      successEl.classList.remove("hidden");
      form.style.display = "none";
      document.getElementById("rsvp").scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Submission error:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      alert("Something went wrong submitting your RSVP. Please try again or email us directly.\n\nError: " + err.message);
    }
  });
});