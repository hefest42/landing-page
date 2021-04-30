"use strict";

const map = document.querySelector(".map");
const modal = document.querySelector(".modal");
const modalLeft = document.querySelector(".modal-left");
const modalRight = document.querySelector(".modal-right");
const formRunning = document.querySelector(".form-input-running");
const formCycling = document.querySelector(".form-input-cycling");
const modalClose = document.querySelectorAll(".close-modal-btn");
const workoutContainer = document.querySelector(".workout-container");

// inputs from running
const inputDistanceRunning = document.querySelector(".input-distance-running");
const inputDurationRunning = document.querySelector(".input-duration-running");
const inputSteps = document.querySelector(".input-steps");

// inputs from cycling
const inputDistanceCycling = document.querySelector(".input-distance-cycling");
const inputDurationCycling = document.querySelector(".input-duration-cycling");
const inputElevation = document.querySelector(".input-elevation");

console.log();
// !defining classes
// Parent Class
class Workout {
    date = new Date();
    id = (Date.now() + "").slice(8);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(
            1
        )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

// Child of Running class
class Running extends Workout {
    type = "running";

    constructor(coords, distance, duration, steps) {
        super(coords, distance, duration);
        this.steps = steps;
        this._calcPace();
        this._setDescription();
    }

    _calcPace() {
        this.pace = this.steps / this.duration;
        return this.pace;
    }
}

// Child of Running class
class Cycling extends Workout {
    type = "cycling";

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this._calcSpeed();
        this._setDescription();
    }

    _calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// --------------------------------------------------------------------------------

class App {
    // whole map
    #map;
    // when clicking on the map storing the location
    #mapEvent;
    // storing all the workouts
    #workout = [];
    #mapZoom = 13;

    constructor() {
        this._getPosition();

        // !giving running/cycling click event listenenrs
        // clicking on running
        modalLeft.addEventListener(
            "click",
            this._displayRunningForm.bind(this)
        );

        // clicking on cycling
        modalRight.addEventListener(
            "click",
            this._displayingCyclingForm.bind(this)
        );

        // ! when pressing the X button on the modal(closing modal)
        modalClose.forEach(btn =>
            btn.addEventListener("click", this._closeInputForm.bind(this))
        );

        // !getting values when submiting form
        // running
        formRunning.addEventListener("submit", this._getWorkout.bind(this));
        // cycling
        formCycling.addEventListener("submit", this._getWorkout.bind(this));

        // when users click on exercise panning over
        workoutContainer.addEventListener("click", this._moveToPin.bind(this));
    }

    _getPosition() {
        navigator.geolocation.getCurrentPosition(
            this._displayMap.bind(this),
            function () {
                alert("Need your location to display the map");
            }
        );
    }

    _displayMap(position) {
        // console.log(position);
        const { latitude, longitude } = position.coords;

        const coords = [latitude, longitude];

        this.#map = L.map("map").setView(coords, this.#mapZoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        this.#map.on("click", this._displayWorkoutChoice.bind(this));
    }

    // displaying the modal with the choice of RUNNING/CYCLCING
    _displayWorkoutChoice(mapE) {
        // console.log(mapE);
        this.#mapEvent = mapE;
        modal.classList.add("modal-display");
    }

    // displaying the form for running
    _displayRunningForm() {
        // hiding the workout choice modal
        modal.classList.remove("modal-display");

        // inputDistanceRunning.focus(); // !terrible bug

        // showing the correct form
        formRunning.classList.add("form-input-display");
    }

    _displayingCyclingForm() {
        // hiding the workout choice modal
        modal.classList.remove("modal-display");

        // displaying the cycling form
        formCycling.classList.add("form-input-display");
    }

    _closeInputForm() {
        inputDurationRunning.value = inputDurationCycling.value = inputDistanceCycling.value = inputDistanceRunning.value = inputSteps.value = inputElevation.value =
            "";

        formRunning.classList.remove("form-input-display");
        formCycling.classList.remove("form-input-display");
    }

    // recieving values from the form
    _getWorkout(e) {
        e.preventDefault();

        const allNumbers = (...inputs) =>
            inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
        const type = e.target.dataset.value;
        let workout;

        if (type === "running") {
            const distance = Number(inputDistanceRunning.value);
            const duration = Number(inputDurationRunning.value);
            const steps = Number(inputSteps.value);
            const { lat, lng } = this.#mapEvent.latlng;

            if (
                !allNumbers(distance, duration, steps) ||
                !allPositive(distance, duration, steps)
            )
                return "Inputs need to be positive numbers";

            workout = new Running([lat, lng], distance, duration, steps);
        }

        if (type === "cycling") {
            const distance = Number(inputDistanceCycling.value);
            const duration = Number(inputDurationCycling.value);
            const elevation = Number(inputElevation.value);
            const { lat, lng } = this.#mapEvent.latlng;

            if (
                !allNumbers(distance, duration, elevation) ||
                !allPositive(distance, duration)
            )
                return "Inputs need to be positive numbers";

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // pushing the workout to #workouts array
        this.#workout.push(workout);

        // displaying the workout in the workout container(left)
        this._renderWorkout(workout);

        // displaying a marker for the workout
        this._renderWorkoutMarker(workout);

        // closing the input form on submitting
        this._closeInputForm();
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                })
            )
            .setPopupContent(`${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        console.log(workout);
        let html;

        if (workout.type === "running") {
            html = `
            <div class="workout workout-running" data-id="${workout.id}">
                <div class="workout-description">${workout.description}</div>
                <div class="stats-container">
                    <div class="stat stat-distance">Distance: ${
                        workout.distance
                    }</div>
                    <div class="stat stat-duration">Duration: ${
                        workout.duration
                    }</div>
                    <div class="stat stat-steps">Steps: ${workout.steps}</div>
                    <div class="stat stat-pace">Pace: ${workout.pace.toFixed(
                        1
                    )}</div>
                </div>
            </div`;
        }

        if (workout.type === "cycling") {
            html = `
            <div class="workout workout-cycling" data-id="${workout.id}">
                <div class="workout-description">${workout.description}</div>
                <div class="stats-container">
                    <div class="stat stat-distance">Distance: ${
                        workout.distance
                    }</div>
                    <div class="stat stat-duration">Duration: ${
                        workout.duration
                    }</div>
                    <div class="stat stat-steps">Speed: ${workout.speed.toFixed(
                        1
                    )}</div>
                    <div class="stat stat-pace">Elevation: ${
                        workout.elevationGain
                    }</div>
                </div>
            </div>`;
        }

        workoutContainer.insertAdjacentHTML("afterbegin", html);
    }

    _moveToPin(e) {
        const workoutEl = e.target.closest(".workout");

        if (!workoutEl) return;

        const workout = this.#workout.find(
            work => work.id === workoutEl.dataset.id
        );

        this.#map.setView(workout.coords, this.#mapZoom, {
            animate: true,
            pan: {
                duration: 1,
            },
        });
    }
}

const app = new App();

// console.log(formRunning);
// console.log(inputDuration, inputDistance, inputSteps);
