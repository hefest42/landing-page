"use strict";

// selecting nav bar elements
const nav = document.querySelector("nav");

// selecting header elements
const headerSpans = document.querySelectorAll(".header-title span");

// selecting section--1 elements
const section1 = document.querySelector("#section--1"); // whole section--1
const section1Span = document.querySelector("#section--1 span"); // every span in section 1
const planContainer = document.querySelector(".plans-container");
const sec1Buttons = document.querySelectorAll(".plan-button"); // all 3 buttons under plans

// selecting section--2 elements
const section2 = document.querySelector("#section--2");
const section2Span = document.querySelectorAll("#section--2 span");

// selecting section--3 elements
const section3 = document.querySelector("#section--3");
const slider = document.querySelector(".slider"); // slide container
const allSlides = document.querySelectorAll(".slide"); // all slides
const btnLeft = document.querySelector(".slider__btn--left"); // left button
const btnRight = document.querySelector(".slider__btn--right"); // right button
// nav bar
const section3Span = document.querySelector("#section--3 span");

// adding a class to the nav bar link  on hover
nav.addEventListener("mouseover", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const clicked = e.target.closest(".link-item");
    clicked.classList.add("link-item-hover");
  }
});

// removing a class to the nav bar link on hover
nav.addEventListener("mouseout", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const clicked = e.target.closest(".link-item");
    clicked.classList.remove("link-item-hover");
  }
});

// adding scroll effect to the nav bar links
nav.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    console.log(id);

    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

// header

window.addEventListener("load", function (e) {
  headerSpans.forEach((el) => {
    el.classList.add("highlight");
  });
});

// section--1

const section1Func = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  if (entry.isIntersecting) {
    section1Span.classList.add("highlight");
  }
};

const section1Obs = new IntersectionObserver(section1Func, {
  root: null,
  threshold: 0.5,
  rootMargin: `150px`,
});

section1Obs.observe(section1);

// adding description to the images in the plan section
planContainer.addEventListener("mouseover", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("plan-image")) {
    const imageDescription = e.target.firstChild.nextElementSibling;
    imageDescription.classList.add("plan-description-hover");
  }
});

// removing description of the image
planContainer.addEventListener("mouseout", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("plan-image")) {
    const imageDescription = e.target.firstChild.nextElementSibling;
    imageDescription.classList.remove("plan-description-hover");
  }
});

// adding classes on mouse hover on the buttons
section1.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("plan-button")) {
    const id = e.target.dataset.value;

    document
      .querySelector(`.plan-button-${id}`)
      .classList.add("button-highlight");

    document
      .querySelector(`.plan-description-${id}`)
      .classList.add("plan-description-hover");
  }
});

// removing classes on mouse hover on the buttons
section1.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("plan-button")) {
    const id = e.target.dataset.value;

    document
      .querySelector(`.plan-button-${id}`)
      .classList.remove("button-highlight");

    const image = document
      .querySelector(`.plan-description-${id}`)
      .classList.remove("plan-description-hover");
  }
});

// section--2

const section2Func = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  if (entry.isIntersecting) {
    section2Span.forEach((el) => {
      el.classList.add("highlight");
    });
  }
};

const section2Obs = new IntersectionObserver(section2Func, {
  root: null,
  threshold: 0.3,
  rootMargin: `300px`,
});

section2Obs.observe(section2);

// section--3

// adding class to the span in section--3

const section3Func = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  if (entry.isIntersecting) {
    section3Span.classList.add("highlight");
  }
};

const section3Obs = new IntersectionObserver(section3Func, {
  root: null,
  threshold: 0.3,
  rootMargin: `150px`,
});

section3Obs.observe(section3);

// slider
let curSlide = 0;
const maxSlide = allSlides.length;

// moving all slider initially
allSlides.forEach((s, i) => {
  s.style.transform = `translateX(${100 * i}%)`;
});

// func for moving slides
const nextSlide = function (slide) {
  allSlides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

// on right button click, moving slides
btnRight.addEventListener("click", function (e) {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  nextSlide(curSlide);
});

// on left button click, moving slides
btnLeft.addEventListener("click", function (e) {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  nextSlide(curSlide);
});
