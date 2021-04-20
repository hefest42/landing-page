'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// opening modal on "Create account" buttons
btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// nav bar buttons navigation 
nav.addEventListener("click", function(e) {
  e.preventDefault();
  const tab = e.target.closest(".nav__link");

  if(!tab) return;

  if(tab) {
    const id = tab.getAttribute("href");
    document.querySelector(`${id}`).scrollIntoView({
      behavior: "smooth"
    });
  };
});
  
// changing the opacity of nav bar elements when hovering 

// hover over function 
const fadeOut = function(e, opacity) {
  e.preventDefault();

  if(e.target.classList.contains("nav__link")) {
    const selectedTab = e.target;
    const tabs = document.querySelectorAll(".nav__link");
    const logo = document.querySelector("#logo");

    tabs.forEach(el => {
      if (selectedTab !== el) {
        el.style.opacity = opacity;
      }
    })
    logo.style.opacity = opacity;
  }  
}

// when the mouse enters the correct tab 
nav.addEventListener("mouseover", function(e) {
  fadeOut(e, 0.5);
});
// when the mouse leaves the tab 
nav.addEventListener("mouseout", function(e) {
  fadeOut(e, 1);
})

// clicking on the "Learn more" button
btnScrollTo.addEventListener("click", function(e) {
  e.preventDefault();

  section1.scrollIntoView({
    behavior: "smooth"
  })
})

// making the nav bar sticky when scrolling past the header
const header = document.querySelector(".header");
const coords1 = nav.getBoundingClientRect()
const navHeight = coords1.height;

const stickyNav = function(entries, observer) {
  
  const [entry] = entries;
  // console.log(entry);
  
  if(!entry.isIntersecting) {
    nav.classList.add("sticky")
  } else {
    nav.classList.remove("sticky")
  };
};

const navObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
navObserver.observe(header);

// section1, 2, and 3 

// displaying them
// selecting all sections
const allSections = document.querySelectorAll(".section");

const sectionFunc = function(entries, observer) {
  const [entry] = entries;
  
  if(!entry.isIntersecting) return;
  
  if(entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(sectionFunc, {
  root: null,
  threshold: 0.15
});

allSections.forEach(el => {
  el.classList.add("section--hidden");
  
  sectionObserver.observe(el);
});


// displaying pictures (lazy images)

const allImages = document.querySelectorAll("img[data-src]");
// console.log(allImages);

const loadImg = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  // replacing small res imagine with the large res img
  entry.target.src = entry.target.dataset.src;
  
  // removing lazy-img class
  entry.target.classList.remove("lazy-img")

}


const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`
})

allImages.forEach(img => {
  imgObserver.observe(img)
})


// operations tabs 

tabsContainer.addEventListener("click", function(e) {

  if(e.target.classList.contains("operations__tab")) {
    const clicked = e.target;
    const tabs = document.querySelectorAll(".operations__tab");

    // removing active class from all the tabs
    tabs.forEach(tab => {
      tab.classList.remove("operations__tab--active")
    });
    // removing active class from all contnet tabs
    tabsContent.forEach(tab => {
      tab.classList.remove("operations__content--active")
    });

    // adding active class to the clicked one
    clicked.classList.add("operations__tab--active");
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active")
  }
});


// slider

const allSlides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let curSlide = 0;
const maxSlide = allSlides.length;

const createDots = function() {
  allSlides.forEach((_, i) => {

    dotContainer.insertAdjacentHTML("beforeend", `
      <button class="dots__dot" data-slide="${i}"></button>
    `);
  })
}
createDots();

const moveSlides = function() {
  allSlides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * i}%)`
  })
}

moveSlides();

const moveSlide = function(slide) {

  allSlides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`
  })
}

// making a dot active
const activeteDot = function(slide) {

  document.querySelectorAll(".dots__dot").forEach(dot => {
    dot.classList.remove("dots__dot--active")
  })

  document
  .querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add("dots__dot--active");
}

activeteDot(curSlide)


// event listeners 
btnRight.addEventListener("click", function(e) {
  e.preventDefault();

  if(curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  moveSlide(curSlide);
  activeteDot(curSlide);
}) 

btnLeft.addEventListener("click", function(e) {
  e.preventDefault();

  if(curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  moveSlide(curSlide);
  activeteDot(curSlide);
})

dotContainer.addEventListener("click", function(e) {

  if(e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;

    moveSlide(slide);
    activeteDot(slide);
  }
})



/*
// pressing learn more button
btnScrollTo.addEventListener("click", function(e) {
  const s1coord = section1.getBoundingClientRect();
  // console.log(s1coord);

  // console.log(e.target.getBoundingClientRect());

  // console.log(
  //   "Current Scroll (X/Y)",
  //   window.pageXOffset,
  //   window.pageYOffset
  // );

  // console.log(
  //   "height/width of viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // scrolling
  // window.scrollTo(s1coord.left + window.pageXOffset, s1coord.top + window.pageYOffset);

  // old methond
  // window.scrollTo({
  //  left: s1coord.left + window.pageXOffset,
  //  top: s1coord.top + window.pageYOffset,
  //  behavior: "smooth",
  // });

  // new method
  section1.scrollIntoView({
    behavior: "smooth"
  })
});

// page navigation 

// document.querySelectorAll(".nav__link").forEach(function(el) {
//   el.addEventListener("click", function(e) {
//     e.preventDefault();
    
//     const id = this.getAttribute("href");
//     console.log(id);

//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth"
//     })
//   });
// });

// 1. add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function(e) {
  e.preventDefault();
  // console.log(e.target);

  // matching strategy(ignoring click that don't happen on link)
  if(e.target.classList.contains("nav__link")) {
    
    const id = e.target.getAttribute("href");
    
    document.querySelector(id).scrollIntoView({
      behavior: "smooth"
    })
  }
});

// tabbed component

tabsContainer.addEventListener("click", function(e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // guard clause
  if(!clicked) return;

  // removing active class from all tabs
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"))
  // active tab
  clicked.classList.add("operations__tab--active");

  // remove active class from all the content area
  tabsContent.forEach(tab => tab.classList.remove("operations__content--active"))
  // activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active")
});

// menu fade animation 

const handleHover = function(e, opacity) {
  // console.log(this);

  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}

// passing an "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));


// sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function(e) {

//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// sticky navigation: intersection observer API

// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => console.log(entry))
// }

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2] 
// };



// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function(entries) {
  const [entry] = entries;
  // console.log(entry);
  if(!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


// reveal section

const allSections = document.querySelectorAll(".section")


const revealSection = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  if(entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target)
  }
} 

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden")
})

// lazy loading images

const imgTarget = document.querySelectorAll("img[data-src]");

const loadImg = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function(e) {
    entry.target.classList.remove("lazy-img");
  })

  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
})

imgTarget.forEach(img => {
  imgObserver.observe(img);
})

// building the slider component
const slidder = function() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");


  let curSlide = 0;
  const maxSlide = slides.length;


  // const slider = document.querySelector(".slider");
  // slider.style.transform = `scale(0.3) translateX(-1400px)`;
  // slider.style.overflow = "visible";

  const createDots = function() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML("beforeend", `
        <button class="dots__dot" data-slide="${i}"></button>
      `);
    });
  };

  const activeteDot = function(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active") 
  }

  const goToSlide = function(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translate(${100 * (i - slide)}%)`;
    })
  };

  const nextSlide = function() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    
    goToSlide(curSlide);
    activeteDot(curSlide);
  }

  const prevSlide = function() {
    if(curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--
    }
    goToSlide(curSlide);
    activeteDot(curSlide);
  }

  const init = function() {
    createDots();
    activeteDot(0);
    goToSlide(0);
  }
  init()

  // EVENT HANDLERS
  // go to the next slide(right)
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function(e) {
    // console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  })

  dotContainer.addEventListener("click", function(e) {
    if(e.target.classList.contains("dots__dot")) {
      const {slide} = e.target.dataset;

      goToSlide(slide);
      activeteDot(slide);
    }
  })
}
slidder();



// selecting elements 
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(".header");
const allSection = document.querySelectorAll(".section");
console.log(allSection);

document.getElementById("section--1");
const allButtons = document.getElementsByTagName("button");
console.log(allButtons);

console.log(document.getElementsByClassName("btn"));

// creating and inserting elements

const message = document.createElement("div");
message.classList.add("cookie-message");
message.textContent = "We use cookies for improved functionality and alaytics.";
message.innerHTML = `We use cokkies for improved functionality and alaytics. <button class="btn btn--close--cookie">Got it!</button>`

// header.prepend(message);// add as the first child
header.append(message); // add as the last child
// header.append(message.cloneNode(true));

// header.before(message); // adds elements before the parent element (header)
// header.after(message); // add element(s) after the parents element (header)

// deleting elements 

document.querySelector(".btn--close--cookie").addEventListener("click", function() {
  // message.remove();
  message.parentElement.removeChild(message);
})

// Styles
message.style.backgroundColor = "#37383d";
message.style.width = "120%"

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

document.documentElement.style.setProperty("--color-primary", "orangered");

// attributes 
const logo = document.querySelector(".nav__logo");
console.log(logo.alt);
console.log(logo.className);

logo.alt = "Beautiful minimalist logo"
// non-standard(doesnt work)
console.log(logo.designer);
console.log(logo.getAttribute("designer"));
logo.setAttribute("company", "Bankist");

console.log(logo.src);
console.log(logo.getAttribute("src"));

const link = document.querySelector(".nav__link--btn")

console.log(link.href);
console.log(link.getAttribute("href"));

// data attributes 
console.log(logo.dataset.versionNumber);

// classes 
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// dont use 
// logo.className = "jonas"


const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function(e) {
  const s1coord = section1.getBoundingClientRect();
  // console.log(s1coord);

  // console.log(e.target.getBoundingClientRect());

  // console.log(
  //   "Current Scroll (X/Y)",
  //   window.pageXOffset,
  //   window.pageYOffset
  // );

  // console.log(
  //   "height/width of viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // scrolling
  // window.scrollTo(s1coord.left + window.pageXOffset, s1coord.top + window.pageYOffset);

  // old methond
  // window.scrollTo({
  //  left: s1coord.left + window.pageXOffset,
  //  top: s1coord.top + window.pageYOffset,
  //  behavior: "smooth",
  // });

  // new method
  section1.scrollIntoView({
    behavior: "smooth"
  })
});

const h1 = document.querySelector("h1");

const alertH1 = function(e) {
  alert("addEventListener: Great! You are reading the heading :D");

  h1.removeEventListener("mouseenter", alertH1);
};

setTimeout(() =>  h1.removeEventListener("mouseenter", alertH1), 3000)

h1.addEventListener("mouseenter", alertH1);

// h1.onmouseenter = function(e) {
//   alert("addEventListener: Great! You are reading the heading :D");
// };



// rgb(25,255,255);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = function() {
  return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
};

document.querySelector(".nav__link").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("link", e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // stop propagation
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("container", e.target, e.currentTarget);
});

document.querySelector(".nav").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("nav", e.target, e.currentTarget);
});


// ---------------------------- DOM TRAVERSING ------------------------------------

const h1 = document.querySelector("h1");

// going downwards: selecting child elements

console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "orangered";

// going upwards: selecing parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";

h1.closest("h1").style.background = "var(--gradient-primary)";

// going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) el.style.transform = "scale(0.5)"
})


document.addEventListener("DOMContentLoaded", function(e) {
  console.log("HTML parsed and DOM tree built!", e);
})

window.addEventListener("load", function(e) {
  console.log("Page fully loaded", e);
})

// window.addEventListener("beforeunload", function(e) {
//   e.preventDefault();

//   console.log(e);
//   e.returnValue = "";
// })
*/