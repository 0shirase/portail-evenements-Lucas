export async function getEvents() {
  try {
    const response = await fetch(
      "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events"
    );
    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
}
