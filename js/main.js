function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(m => {
    if (event.target === m) m.style.display = "none";
  });
}
