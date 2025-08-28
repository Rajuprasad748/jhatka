// src/utils/betUtils.js

// ------------------ Bet Options ------------------
export const betOptions = [
  { name: "Single Digit", parts: [{ label: "Digits", len: 1 }] },
  { name: "Jodi", parts: [{ label: "Digits", len: 2 }] },
  { name: "Single Pana", parts: [{ label: "Digits", len: 3 }] },
  { name: "Double Pana", parts: [{ label: "Digits", len: 3 }] },
  { name: "Triple Pana", parts: [{ label: "Digits", len: 3 }] },
  {
    name: "Half Sangam",
    parts: [{ label: "Open Digit" }, { label: "Close Pana" }],
  },
  {
    name: "Full Sangam (XXX-XX-XXX)",
    parts: [
      { label: "First Part", len: 3 },
      { label: "Second Part", len: 3 },
    ],
  },
];

// ------------------ Bet Type Map ------------------
export const betTypeMap = {
  "Single Digit": "singleDigit",
  Jodi: "jodi",
  "Single Pana": "singlePana",
  "Double Pana": "doublePana",
  "Triple Pana": "triplePana",
  "Half Sangam": "halfSangam",
  "Full Sangam (XXX-XX-XXX)": "fullSangam",
};

// ------------------ Parse Time ------------------
export const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let [, h, m, meridian] = match;
  let hours = parseInt(h, 10);
  const minutes = m ? parseInt(m, 10) : 0;

  if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// ------------------ Check Disabled ------------------
export const getDisabledState = (game, selectedOption, session) => {
  if (!game) return { openDisabled: false, closeDisabled: false, submitDisabled: false };

  const now = new Date();
  const openTime = parseTime(game.openingTime);
  const closeTime = parseTime(game.closingTime);

  if (!openTime || !closeTime)
    return { openDisabled: false, closeDisabled: false, submitDisabled: false };

  let openDisabled = false;
  let closeDisabled = false;
  let submitDisabled = false;

  // Disable open after opening time
  if (now >= openTime) {
    openDisabled = true;
    if (session === "open") {
      session = "close"; // auto-switch
    }
  }

  // Disable close and submit after closing time
  if (now >= closeTime) {
    closeDisabled = true;
    submitDisabled = true;
  }

  // Restrict Jodi / Half / Full after open
  let adjustedOption = selectedOption;
  if (
    openDisabled &&
    ["jodi", "half sangam", "full sangam"].some((opt) =>
      selectedOption.toLowerCase().includes(opt)
    )
  ) {
    adjustedOption = "Single Digit";
  }

  return { openDisabled, closeDisabled, submitDisabled, adjustedOption, session };
};
