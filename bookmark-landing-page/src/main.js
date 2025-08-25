const body = document.querySelector("body");
const nav = document.querySelector(".nav");
const navBtn = document.querySelector(".nav__btn");
const navMenu = document.querySelector(".header__nav-menu");
const overlay = document.querySelector(".overlay");
const headerLogo = document.querySelector(".logo");
const headerSocials = document.querySelector(".header__socials");

const featureTabs = document.querySelector(".feature__tabs");
const featureTab = document.querySelectorAll(".feature__tab");
const featurePanel = document.querySelectorAll(".feature__panel");

const form = document.querySelector(".form");
const emailContainer = document.querySelector(".email__container");
const errorIcon = document.querySelector(".error-icon");

let removeTrapFocus; //cleanup variable for trap

navBtn.addEventListener("click", openCloseNav);

featureTab.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});

form.addEventListener("submit", validateForm);

function openCloseNav() {
  const hamburger = navBtn.querySelector("img");
  const logoCircle = headerLogo.querySelector(".logo__circle");
  const logoText = headerLogo.querySelector(".logo__text");
  const bookmarkIcon = headerLogo.querySelector(".logo__bookmark-icon");

  const isClose = hamburger.src.includes("icon-hamburger.svg");

  hamburger.src = isClose
    ? "/images/icon-close.svg"
    : "/images/icon-hamburger.svg";

  overlay.classList.toggle("hidden");
  navMenu.classList.toggle("hidden");
  body.classList.toggle("no-scroll");

  navBtn.setAttribute("aria-expanded", isClose ? "true" : "false");

  logoCircle.setAttribute("fill", isClose ? "#fff" : "#5267DF");
  logoText.setAttribute("fill", isClose ? "#fff" : "#242A45");
  bookmarkIcon.setAttribute("fill", isClose ? "#242A45" : "#fff");

  headerSocials.classList.toggle("hidden", !isClose);
  headerSocials.classList.toggle("flex", isClose);

  if (isClose) {
    removeTrapFocus = trapFocus(nav);
  } else {
    if (removeTrapFocus) {
      removeTrapFocus();
      removeTrapFocus = null;
    }
  }
}

function handleTabClick(e) {
  // remove active class to all tabs and aria
  featureTab.forEach((tab) => {
    tab.classList.remove("active");
    tab.setAttribute("aria-selected", "false");
  });

  // add active class to clicked tab
  const clickedTab = e.currentTarget;
  clickedTab.classList.add("active");
  clickedTab.setAttribute("aria-selected", "true");

  // remove active class to all panel only clicked is active
  featurePanel.forEach((panel) => {
    panel.classList.remove("active");
    panel.classList.add("hidden");
  });

  const panelId = clickedTab.getAttribute("aria-controls");
  const targetPanel = document.getElementById(panelId);
  targetPanel.classList.add("active");
  targetPanel.classList.remove("hidden");
}

// last one is form validation
function validateForm(e) {
  e.preventDefault();
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    showError("Whoops, email is required");
  } else if (!emailPattern.test(email)) {
    showError("Whoops, make sure its an email");
  } else {
    hideError();
    console.log("Email valid: submitting...");
    form.reset(); // ✅ resets all inputs in the form
  }
}

function showError(message) {
  const errorMsg = document.getElementById("error-msg");
  // const emailInput = document.getElementById("email");

  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
  errorIcon.classList.remove("hidden");
  emailContainer.classList.add("error-visual");
}

function hideError() {
  const errorMsg = document.getElementById("error-msg");
  // const emailInput = document.getElementById("email");

  errorMsg.textContent = "";
  errorMsg.classList.add("hidden");
  errorIcon.classList.add("hidden");
  emailContainer.classList.remove("error-visual");
}

// add trap focus for nav accessibility

// TODO: for accessibility
function trapFocus(container) {
  const navFocusables = container.querySelectorAll(
    ".nav__home-link, .nav__btn, .nav__link, .nav__social-link",
  );

  const firstEl = navFocusables[0];
  const lastEl = navFocusables[navFocusables.length - 1];

  function handleNavTrap(e) {
    const isMobile = window.innerWidth < 768;

    if (e.key !== "Tab") return;

    // check width at the moment of keydown
    if (!isMobile) return;

    // e.shiftKey - shift + tab condition
    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  container.addEventListener("keydown", handleNavTrap);

  return () => container.removeEventListener("keydown", handleNavTrap);
}
