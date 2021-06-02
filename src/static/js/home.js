document.addEventListener("DOMContentLoaded", () => {
  const gettingStartedBtn = document.querySelector(".getting-started-btn");
  const text = document.querySelector(".getting-started-btn .typewriter");

  gettingStartedBtn.addEventListener("mouseover", e => {
    text.classList.add("text-dark");
  });
  gettingStartedBtn.addEventListener("mouseout", e => {
    text.classList.remove("text-dark");
  });
});
