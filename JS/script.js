//Call others .js files
import { getEvents } from "./api.js";
import { openModal, setupModalListeners } from "./modal.js";
import { setCookie, getCookie } from "./cookies.js";

document.addEventListener("DOMContentLoaded", async () => {
  const events = await getEvents();
  const container = document.getElementById("event-list");
  /* console.log(events); */

  //Event creation
  events.forEach((event) => {
    //createElement cards
    const eventElement = document.createElement("article");
    const eventHeader = document.createElement("div");
    const eventTitle = document.createElement("h3");
    const favStar = document.createElement("i");
    const eventDate = document.createElement("p");
    const eventLocation = document.createElement("p");

    //classList add
    eventElement.classList.add("event");
    eventHeader.classList.add("event-header");

    //textContent
    eventTitle.textContent = event.title;
    eventDate.textContent = ` Date et heure: ${new Date(
      event.start_date
    ).toLocaleString()}`;
    eventLocation.textContent = ` Lieu: ${
      event.venue?.address || "Lieu non précisé"
    }`;

    //fav event
    favStar.className = "fa-regular fa-star favorite-icon";
    favStar.dataset.id = event.id;
    favStar.title = "Ajouter à mon planning";

    const planning = JSON.parse(localStorage.getItem("planning")) || [];
    const alreadySaved = planning.some((e) => e.id === event.id);
    if (alreadySaved) {
      favStar.classList.remove("fa-regular");
      favStar.classList.add("fa-solid");
      favStar.title = "Déjà dans le planning";
    }
    //appendChild stars
    eventHeader.appendChild(eventTitle);
    eventHeader.appendChild(favStar);

    // Button open Modal
    const button = document.createElement("button");
    button.classList.add("details-button");
    button.dataset.id = event.id;
    button.textContent = "Voir les détails";

    button.addEventListener("click", () => openModal(event));

    // appendChild
    eventElement.appendChild(eventHeader);
    eventElement.appendChild(eventDate);
    eventElement.appendChild(eventLocation);
    eventElement.appendChild(button);
    container.appendChild(eventElement);

    //favStar animation
    favStar.addEventListener("click", () => {
      favStar.classList.add("vibrate");

      for (let i = 0; i < 7; i++) {
        const miniStar = document.createElement("i");
        miniStar.className = "fa-solid fa-star mini-star";

        favStar.appendChild(miniStar);

        miniStar.addEventListener("animationend", () => {
          miniStar.remove();
        });
      }
    });
    // myplanning section
    const planningList = document.getElementById("planning-list");

    favStar.addEventListener("click", () => {
      // Animation
      favStar.classList.add("vibrate");
      for (let i = 0; i < 7; i++) {
        const miniStar = document.createElement("i");
        miniStar.className = "fa-solid fa-star mini-star";
        favStar.appendChild(miniStar);
        miniStar.addEventListener("animationend", () => miniStar.remove());
      }

      // localStorage my planning
      const planning = JSON.parse(localStorage.getItem("planning")) || [];
      const alreadyInPlanning = planning.some((e) => e.id === event.id);
      if (!alreadyInPlanning) {
        planning.push(event);
        localStorage.setItem("planning", JSON.stringify(planning));
        renderPlanning();
      }
      // stars on click from regular to solid
      favStar.classList.remove("fa-regular");
      favStar.classList.add("fa-solid");
      favStar.title = "Déjà dans le planning";
    });
  });

  //functions listener call
  setupModalListeners();

  const themeButton = document.getElementById("theme");
  const body = document.body;

  // Apply dark theme if cookie exists
  const savedTheme = getCookie("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  // toggle theme and saving cookies
  themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    setCookie("theme", isDark ? "dark" : "light");
  });
});

//myplanning function
function renderPlanning() {
  const planningList = document.getElementById("planning-list");

  // article delete
  const oldArticles = planningList.querySelectorAll("article");
  oldArticles.forEach((a) => a.remove());

  const planning = JSON.parse(localStorage.getItem("planning")) || [];

  // article myplanning creation
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

    // delete icone + localStorage
    const trash = document.createElement("i");
    trash.className = "fa-solid fa-trash delete-icon";

    trash.addEventListener("click", () => {
      const updatedPlanning = planning.filter((e) => e.id !== event.id);
      localStorage.setItem("planning", JSON.stringify(updatedPlanning));
      renderPlanning();

      const eventStar = document.querySelector(
        `.favorite-icon[data-id="${event.id}"]`
      );
      if (eventStar) {
        eventStar.classList.remove("fa-solid");
        eventStar.classList.add("fa-regular");
        eventStar.title = "Ajouter à mon planning";
      }
    });

    // button show details myPlanning
    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details-button");
    detailsButton.textContent = "Voir les détails";
    detailsButton.addEventListener("click", () => openModal(event));

    // appendChild planning articles
    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(location);
    article.appendChild(detailsButton);
    article.appendChild(trash);
    planningList.appendChild(article);
  });
}

renderPlanning();
