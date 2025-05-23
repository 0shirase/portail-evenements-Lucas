import { getEvents } from "./api.js";
import { openModal, setupModalListeners } from "./modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  const events = await getEvents();
  const container = document.getElementById("event-list");

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
});
