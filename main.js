// main.js

console.log("Welcome to the Community Portal");

window.onload = () => alert("Page is fully loaded");

// Event constructor
function Event(name, date, category, seats, location) {
  this.name = name;
  this.date = date;
  this.category = category;
  this.seats = seats;
  this.location = location;
}

Event.prototype.checkAvailability = function () {
  return this.seats > 0;
};

// Initial events
const allEvents = [
  new Event("Local Music Night", "2025-06-15", "Music", 10, "Park"),
  new Event("Workshop on Baking", "2025-06-20", "Workshop", 5, "Room 101"),
];

// DOM Elements
const selectedEventsContainer = document.getElementById("selected-events");
const registerForm = document.getElementById("register-form");
const eventDatalist = document.getElementById("events-list");

// Render events one by one vertically
function renderSelectedEvents() {
  selectedEventsContainer.innerHTML = "";
  allEvents.forEach((event) => {
    // Show only upcoming and seats available events
    if (new Date(event.date) >= new Date() && event.seats > 0) {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p class="seats">Seats left: ${event.seats}</p>
        <button class="register-btn" data-event="${event.name}" ${event.seats === 0 ? "disabled" : ""}>Register</button>
      `;
      selectedEventsContainer.appendChild(card);
    }
  });
}

// Update datalist options for the input
function updateEventDatalist() {
  eventDatalist.innerHTML = "";
  allEvents.forEach((event) => {
    const option = document.createElement("option");
    option.value = event.name;
    eventDatalist.appendChild(option);
  });
}

// Registration logic
function registerUser(name, email, eventName, phone, comments) {
  try {
    if (!name || !email || !eventName) throw new Error("All required fields must be filled");

    const event = allEvents.find((e) => e.name === eventName);
    if (!event) throw new Error("Event not found");
    if (event.seats <= 0) throw new Error("No seats available");

    event.seats--;

    let message = `Thank you, ${name}, for registering for "${eventName}"!`;
    if (phone) message += `\nPhone: ${phone}`;
    if (comments) message += `\nComments: ${comments}`;

    alert(message);

    renderSelectedEvents();
    updateEventDatalist();
  } catch (err) {
    alert(`Registration failed: ${err.message}`);
    throw err;
  }
}

// Clear all error messages
function clearErrors() {
  registerForm.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
}

// Form submit handler
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  let valid = true;

  const nameInput = registerForm.elements["name"];
  const emailInput = registerForm.elements["email"];
  const phoneInput = registerForm.elements["phone"];
  const commentsInput = registerForm.elements["comments"];
  const eventInput = registerForm.elements["event"];

  // Name validation
  if (!nameInput.value.trim()) {
    valid = false;
    nameInput.nextElementSibling.textContent = "Name is required";
  }

  // Email validation
  if (!emailInput.value.trim()) {
    valid = false;
    emailInput.nextElementSibling.textContent = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
    valid = false;
    emailInput.nextElementSibling.textContent = "Email format invalid";
  }

  // Phone validation (optional)
  if (phoneInput.value.trim()) {
    const phonePattern = /^\+?\d{7,15}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      valid = false;
      phoneInput.nextElementSibling.textContent = "Invalid phone number";
    }
  }

  // Event validation
  if (!eventInput.value.trim()) {
    valid = false;
    eventInput.nextElementSibling.textContent = "Please select an event";
  } else if (!allEvents.some((e) => e.name === eventInput.value.trim())) {
    valid = false;
    eventInput.nextElementSibling.textContent = "Event not found";
  }

  if (valid) {
    try {
      registerUser(
        nameInput.value.trim(),
        emailInput.value.trim(),
        eventInput.value.trim(),
        phoneInput.value.trim(),
        commentsInput.value.trim()
      );
      registerForm.reset();
    } catch (err) {
      // already alerted in registerUser
    }
  }
});

// Register button on event cards: autofill event input and focus name
selectedEventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("register-btn")) {
    const eventName = e.target.dataset.event;
    registerForm.elements["event"].value = eventName;
    registerForm.elements["name"].focus();
  }
});

// Initialize page content
renderSelectedEvents();
updateEventDatalist();

// jQuery example button click
$("#registerBtn").click(() => {
  alert("This is a jQuery example button!");
});
