import { getEvents } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const events = await getEvents();

  events.forEach((event) => {
    const title = event.title;
    const date = new Date(event.start_date).toLocaleString();
    const location = event.venue?.address || "Lieu non précisé";

    console.log("Titre :", title);
    console.log("Date :", date);
    console.log("Lieu :", location);
    console.log("--------------------");
  });
});
