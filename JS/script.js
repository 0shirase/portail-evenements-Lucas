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

      favStar.addEventListener(
        "animationend",
        () => {
          favStar.classList.remove("vibrate");
        },
        { once: true }
      );
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

  // toggle theme and save cookie
  themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    setCookie("theme", isDark ? "dark" : "light");
  });
});
