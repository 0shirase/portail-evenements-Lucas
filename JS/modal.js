const modal = document.getElementById("event-modal");
const closeModalBtn = document.getElementById("close-modal");

const modalTitle = document.getElementById("modal-title");
const modalDatetime = document.getElementById("modal-datetime");
const modalLocation = document.getElementById("modal-location");
const modalDescription = document.getElementById("modal-description");
const modalLink = document.getElementById("modal-link");

export function openModal(event) {
  modalTitle.textContent = event.title;
  modalDatetime.textContent = `Date : ${new Date(
    event.start_date
  ).toLocaleString()}`;
  modalLocation.textContent = `Lieu : ${
    event.venue?.address || "Lieu non précisé"
  }`;
  modalDescription.innerHTML =
    event.description || "Pas de description disponible.";
  modalLink.href = event.url;
  modalLink.textContent = "Voir la source";

  modal.classList.remove("hidden");
  modal.classList.add("active");
}

export function closeModal() {
  modal.classList.remove("active");
  modal.addEventListener(
    "transitionend",
    () => {
      if (!modal.classList.contains("active")) {
        modal.classList.add("hidden");
      }
    },
    { once: true }
  );
}

export function setupModalListeners() {
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
