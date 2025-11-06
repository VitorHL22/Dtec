// Menu responsivo
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("show"));

// Animação suave de entrada
const fadeEls = document.querySelectorAll(".fade");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
});
fadeEls.forEach((el) => observer.observe(el));
