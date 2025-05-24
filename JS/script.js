// Imports
import { getEvents } from "./api.js";
import { openModal, setupModalListeners } from "./modal.js";
import { setCookie, getCookie } from "./cookies.js";

// Events Articles
document.addEventListener("DOMContentLoaded", async () => {
  const events = await getEvents();
  const container = document.getElementById("event-list");

  events.forEach((event) => {
    const eventElement = document.createElement("article");
    const eventHeader = document.createElement("div");
    const eventTitle = document.createElement("h3");
    const favStar = document.createElement("i");
    const eventDate = document.createElement("p");
    const eventLocation = document.createElement("p");
    const detailsButton = document.createElement("button");

    //add API infos in articles
    eventElement.classList.add("event");
    eventHeader.classList.add("event-header");
    eventTitle.textContent = event.title;
    eventDate.textContent = `Date et heure: ${new Date(
      event.start_date
    ).toLocaleString()}`;
    eventLocation.textContent = `Lieu: ${
      event.venue?.address || "Lieu non précisé"
    }`;

    // Stars icon
    favStar.className = "fa-regular fa-star favorite-icon";
    favStar.dataset.id = event.id;
    favStar.title = "Ajouter à mon planning";
    favStar.setAttribute("aria-label", "Ajouter cet événement à mon planning");
    favStar.setAttribute("role", "button");
    favStar.setAttribute("tabindex", "0");

    if (isEventInPlanning(event.id)) {
      favStar.classList.replace("fa-regular", "fa-solid");
      favStar.title = "Déjà dans le planning";
      favStar.setAttribute("aria-label", "Événement déjà dans le planning");
    }

    favStar.addEventListener("click", () => {
      playStarAnimation(favStar);
      if (addEventToPlanning(event)) {
        favStar.classList.replace("fa-regular", "fa-solid");
        favStar.title = "Déjà dans le planning";
        favStar.setAttribute("aria-label", "Événement déjà dans le planning");
        renderPlanning();
      }
    });

    // Modal Buttons
    detailsButton.classList.add("details-button");
    detailsButton.dataset.id = event.id;
    detailsButton.textContent = "Voir les détails";
    detailsButton.setAttribute(
      "aria-label",
      `Voir les détails de l'événement ${event.title}`
    );
    detailsButton.setAttribute("role", "button");
    detailsButton.setAttribute("tabindex", "0");
    detailsButton.addEventListener("click", () => openModal(event));

    // AppendCHild Events
    eventHeader.append(eventTitle, favStar);
    eventElement.append(eventHeader, eventDate, eventLocation, detailsButton);
    container.appendChild(eventElement);
  });

  renderPlanning();
  setupModalListeners();

  // Darktheme
  const themeButton = document.getElementById("theme");
  const body = document.body;
  themeButton.setAttribute("aria-label", "Changer le thème clair/sombre");
  themeButton.setAttribute("role", "button");
  themeButton.setAttribute("tabindex", "0");
  if (getCookie("theme") === "dark") {
    body.classList.add("dark");
  }

  themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    setCookie("theme", isDark ? "dark" : "light");
  });
});

// Myplanning
function getPlanning() {
  return JSON.parse(localStorage.getItem("planning")) || [];
}

function savePlanning(planning) {
  localStorage.setItem("planning", JSON.stringify(planning));
}

function isEventInPlanning(id) {
  return getPlanning().some((e) => e.id === id);
}

function addEventToPlanning(event) {
  const planning = getPlanning();
  if (!isEventInPlanning(event.id)) {
    planning.push(event);
    savePlanning(planning);
    return true;
  }
  return false;
}

function removeEventFromPlanning(id) {
  const updated = getPlanning().filter((e) => e.id !== id);
  savePlanning(updated);
}

//  favStars animation
function playStarAnimation(target) {
  target.classList.add("vibrate");
  for (let i = 0; i < 7; i++) {
    const miniStar = document.createElement("i");
    miniStar.className = "fa-solid fa-star mini-star";
    target.appendChild(miniStar);
    miniStar.addEventListener("animationend", () => miniStar.remove());
  }
}

// articles myPlanning
function renderPlanning() {
  const planningList = document.getElementById("planning-list");
  planningList.innerHTML = "";

  const planning = getPlanning();
  planning.forEach((event) => {
    const article = document.createElement("article");
    article.classList.add("event");

    const title = document.createElement("h3");
    title.textContent = event.title;

    const date = document.createElement("p");
    date.textContent = `Date et heure: ${new Date(
      event.start_date
    ).toLocaleString()}`;

    const location = document.createElement("p");
    location.textContent = `Lieu: ${
      event.venue?.address || "Lieu non précisé"
    }`;

    const trash = document.createElement("i");
    trash.className = "fa-solid fa-trash delete-icon";
    trash.title = "Retirer du planning";
    trash.setAttribute(
      "aria-label",
      `Retirer l'événement ${event.title} du planning`
    );
    trash.setAttribute("role", "button");
    trash.setAttribute("tabindex", "0");
    trash.addEventListener("click", () => {
      removeEventFromPlanning(event.id);
      renderPlanning();

      const eventStar = document.querySelector(
        `.favorite-icon[data-id="${event.id}"]`
      );
      if (eventStar) {
        eventStar.classList.remove("fa-solid");
        eventStar.classList.add("fa-regular");
        eventStar.title = "Ajouter à mon planning";
        eventStar.setAttribute(
          "aria-label",
          "Ajouter cet événement à mon planning"
        );
      }
    });

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details-button");
    detailsButton.textContent = "Voir les détails";
    detailsButton.setAttribute(
      "aria-label",
      `Voir les détails de l'événement ${event.title}`
    );
    detailsButton.addEventListener("click", () => openModal(event));

    article.append(title, date, location, detailsButton, trash);
    planningList.appendChild(article);
  });
}
