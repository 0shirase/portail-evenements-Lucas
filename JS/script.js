//Call others .js files
import { getEvents } from "./api.js";
import { openModal, setupModalListeners } from "./modal.js";
import { setCookie, getCookie } from "./cookies.js";

document.addEventListener("DOMContentLoaded", async () => {
  const events = await getEvents();
  const container = document.getElementById("event-list");

  //Event creation
  events.forEach((event) => {
    const eventElement = document.createElement("article");
    eventElement.classList.add("event");

    // Header
    const header = document.createElement("div");
    header.classList.add("event-header");

    const title = document.createElement("h3");
    title.textContent = event.title;

    const star = document.createElement("i");
    star.className = "fa-solid fa-star favorite-icon";
    star.dataset.id = event.id;
    star.title = "Ajouter à mon planning";

    header.appendChild(title);
    header.appendChild(star);

    // Date
    const date = document.createElement("p");
    date.innerHTML = `<p>Date :</p> ${new Date(
      event.start_date
    ).toLocaleString()}`;

    // Lieu
    const location = document.createElement("p");
    location.innerHTML = `<p>Lieu :</p> ${
      event.venue?.address || "Lieu non précisé"
    }`;

    // Button open Modal
    const button = document.createElement("button");
    button.classList.add("details-button");
    button.dataset.id = event.id;
    button.textContent = "Voir les détails";

    button.addEventListener("click", () => openModal(event));

    // appendChild
    eventElement.appendChild(header);
    eventElement.appendChild(date);
    eventElement.appendChild(location);
    eventElement.appendChild(button);

    container.appendChild(eventElement);
  });

  //functions listener call
  setupModalListeners();
  console.log(getCookie);

  const themeButton = document.getElementById("theme");
  const body = document.body;

  // Apply dark theme if cookie exists
  const savedTheme = getCookie("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  // toggle theme and save cookie
  themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    setCookie("theme", isDark ? "dark" : "light");
  });
});
