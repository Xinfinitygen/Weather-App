/* ==========================================
   WEATHER APP
   ------------------------------------------
   This app allows users to:
   - Search for a city's weather
   - View a 5-day forecast
   - Use their current location
   - Save the last 5 searched cities
   - Toggle between Celsius and Fahrenheit

   Weather data is fetched from:
   Open-Meteo API
========================================== */


/* ==========================================
   GET DOM ELEMENTS
   ------------------------------------------
   Store references to HTML elements so
   they can be updated dynamically.
========================================== */

// Search elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

// Weather display elements
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

// Temperature unit toggle button
const unitBtn = document.getElementById("unitBtn");

// Weather stats
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const uvIndex = document.getElementById("uv-index");

// Loading and error message elements
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

// Search history and forecast containers
const historyContainer = document.getElementById("history-container");
const forecastContainer = document.querySelector(".forecast-list");


/* ==========================================
   GLOBAL VARIABLES
   ------------------------------------------
   These variables help us keep track of
   the current weather data and selected
   temperature unit.
========================================== */

// Current temperature unit (default = Celsius)
let currentUnit = "C";

// Stores the most recent weather response
let currentWeatherData = null;

// Stores the current city and country
let currentCity = "";
let currentCountry = "";


/* ==========================================
   HELPER FUNCTIONS
   ------------------------------------------
   Small reusable functions used throughout
   the application.
========================================== */

// Show or hide the loading message
function showLoading(show) {
    loading.style.display = show ? "block" : "none";
}

// Display an error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Hide the error message
function clearError() {
    errorMessage.style.display = "none";
}


/* ==========================================
   WEATHER CODE MAPPING
   ------------------------------------------
   Converts Open-Meteo weather codes
   into readable text, icons and
   animation classes.
========================================== */

function getWeatherDescription(code) {

    if (code === 0) {
        return {
            description: "Clear Sky",
            icon: "☀️",
            animation: "sun-animation"
        };
    }

    if ([1, 2, 3].includes(code)) {
        return {
            description: "Partly Cloudy",
            icon: "⛅",
            animation: "cloud-animation"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            description: "Foggy",
            icon: "🌫️",
            animation: "cloud-animation"
        };
    }

    if ([51, 53, 55].includes(code)) {
        return {
            description: "Drizzle",
            icon: "🌦️",
            animation: "rain-animation"
        };
    }

    if ([61, 63, 65].includes(code)) {
        return {
            description: "Rain",
            icon: "🌧️",
            animation: "rain-animation"
        };
    }

    if ([71, 73, 75].includes(code)) {
        return {
            description: "Snow",
            icon: "❄️",
            animation: "snow-animation"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            description: "Rain Showers",
            icon: "🌦️",
            animation: "rain-animation"
        };
    }

    if (code === 95) {
        return {
            description: "Thunderstorm",
            icon: "⛈️",
            animation: "thunder-animation"
        };
    }

    return {
        description: "Unknown",
        icon: "❓",
        animation: ""
    };
}


/* ==========================================
   TEMPERATURE CONVERSION
   ------------------------------------------
   Used for the °C / °F toggle feature.
========================================== */

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(temp) {
    return (temp * 9 / 5) + 32;
}

// Return the correct temperature based
// on the selected unit.
function convertTemp(temp) {

    if (currentUnit === "F") {
        return Math.round(
            celsiusToFahrenheit(temp)
        );
    }

    return Math.round(temp);
}


/* ==========================================
   API FUNCTIONS
   ------------------------------------------
   Functions responsible for communicating
   with the Open-Meteo APIs.
========================================== */


/**
 * Get city coordinates from Open-Meteo
 * Geocoding API.
 *
 * Example:
 * "Lagos" → latitude + longitude
 */
async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return data.results[0];
}


/**
 * Fetch weather information using
 * latitude and longitude.
 */
async function getWeather(lat, lon) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max&timezone=auto`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}

/* ==========================================
   DISPLAY CURRENT WEATHER
   ------------------------------------------
   Updates the weather card with the
   current weather information returned
   from the API.
========================================== */

function displayCurrentWeather(data, city, country) {

    // Get weather description and icon
    const weatherInfo =
        getWeatherDescription(
            data.current.weather_code
        );

    // Update city name
    cityName.textContent =
        `${city}, ${country}`;

    // Update weather icon
    weatherIcon.textContent =
        weatherInfo.icon;

    /*
        Remove old animation classes
        before applying the new one.
    */
    weatherIcon.className = "";

    /*
        Apply animation based on the
        current weather condition.
    */
    weatherIcon.classList.add(
        weatherInfo.animation
    );

    // Update temperature using the
    // currently selected unit
    temperature.textContent =
        `${convertTemp(
            data.current.temperature_2m
        )}°${currentUnit}`;

    // Update weather description
    description.textContent =
        weatherInfo.description;

    // Update humidity
    humidity.textContent =
        `${data.current.relative_humidity_2m}%`;

    // Update wind speed
    windSpeed.textContent =
        `${Math.round(
            data.current.wind_speed_10m
        )} km/h`;

    // Get today's UV index
    const uv =
        data.daily.uv_index_max[0];

    // Convert UV value into readable text
    if (uv <= 2) {
        uvIndex.textContent = "Low";
    } else if (uv <= 5) {
        uvIndex.textContent = "Moderate";
    } else if (uv <= 7) {
        uvIndex.textContent = "High";
    } else {
        uvIndex.textContent = "Very High";
    }
}


/* ==========================================
   DISPLAY 5-DAY FORECAST
   ------------------------------------------
   Creates forecast cards dynamically
   using forecast data from the API.
========================================== */

function displayForecast(daily) {

    // Remove existing forecast cards
    forecastContainer.innerHTML = "";

    // Create 5 forecast cards
    for (let i = 0; i < 5; i++) {

        const weatherInfo =
            getWeatherDescription(
                daily.weather_code[i]
            );

        // Convert date into weekday
        const date =
            new Date(daily.time[i]);

        const day =
            date.toLocaleDateString(
                "en-US", {
                    weekday: "long"
                }
            );

        // Create forecast card
        const item =
            document.createElement("div");

        item.classList.add(
            "forecast-item"
        );

        item.innerHTML = `
            <span class="day">
                ${day}
            </span>

            <span class="icon">
                ${weatherInfo.icon}
            </span>

            <div class="temp">
                <span class="high-temp">
                    ${convertTemp(
                        daily.temperature_2m_max[i]
                    )}°
                </span>

                <span class="low-temp">
                    ${convertTemp(
                        daily.temperature_2m_min[i]
                    )}°
                </span>
            </div>
        `;

        forecastContainer.appendChild(
            item
        );
    }
}


/* ==========================================
   TEMPERATURE UNIT TOGGLE
   ------------------------------------------
   Switches between Celsius and
   Fahrenheit without making another
   API request.
========================================== */

function toggleUnit() {

    // Prevent errors if weather
    // has not been loaded yet
    if (!currentWeatherData) {
        return;
    }

    // Switch units
    currentUnit =
        currentUnit === "C" ?
        "F" :
        "C";

    // Update button text
    unitBtn.textContent =
        currentUnit === "C" ?
        "Switch to °F" :
        "Switch to °C";

    // Re-render weather data
    displayCurrentWeather(
        currentWeatherData,
        currentCity,
        currentCountry
    );

    displayForecast(
        currentWeatherData.daily
    );
}


/* ==========================================
   USER LOCATION WEATHER
   ------------------------------------------
   Gets the user's current location
   and automatically loads weather
   data for that location.
========================================== */

function getUserLocationWeather() {

    // Stop if geolocation is not supported
    if (!navigator.geolocation) {
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                showLoading(true);

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                const weather =
                    await getWeather(
                        lat,
                        lon
                    );

                // Save weather data for toggle feature
                currentWeatherData =
                    weather;

                currentCity =
                    "Your Location";

                currentCountry = "";

                // Update UI
                displayCurrentWeather(
                    weather,
                    currentCity,
                    currentCountry
                );

                displayForecast(
                    weather.daily
                );

            } catch (error) {

                console.log(error);

            } finally {

                showLoading(false);
            }
        }
    );
}


/* ==========================================
   SEARCH HISTORY
   ------------------------------------------
   Stores the last 5 searched cities
   in localStorage and displays them
   as quick access buttons.
========================================== */


/**
 * Save searched city
 * to localStorage.
 */
function saveSearch(city) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "weatherHistory"
            )
        ) || [];

    // Remove duplicate city names
    history = history.filter(
        item =>
        item.toLowerCase() !==
        city.toLowerCase()
    );

    // Add newest search
    history.unshift(city);

    // Keep only 5 cities
    history = history.slice(0, 5);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


/**
 * Display history buttons.
 */
function renderHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "weatherHistory"
            )
        ) || [];

    historyContainer.innerHTML = "";

    history.forEach(city => {

        const btn =
            document.createElement(
                "button"
            );

        btn.classList.add(
            "history-btn"
        );

        btn.textContent = city;

        // Search city when clicked
        btn.onclick = () => {

            cityInput.value = city;

            handleSearch();
        };

        historyContainer.appendChild(
            btn
        );
    });
}


/* ==========================================
   SEARCH WEATHER
   ------------------------------------------
   Main function responsible for:
   1. Getting city name
   2. Finding coordinates
   3. Fetching weather data
   4. Updating the UI
========================================== */

async function handleSearch() {

    const city =
        cityInput.value.trim();

    // Validate input
    if (!city) {

        showError(
            "Please enter a city"
        );

        return;
    }

    try {

        clearError();

        showLoading(true);

        // Get city coordinates
        const location =
            await getCoordinates(
                city
            );

        // Get weather data
        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );

        // Save weather for unit toggle
        currentWeatherData =
            weather;

        currentCity =
            location.name;

        currentCountry =
            location.country;

        // Update UI
        displayCurrentWeather(
            weather,
            currentCity,
            currentCountry
        );

        displayForecast(
            weather.daily
        );

        // Save city to history
        saveSearch(
            location.name
        );

    } catch (error) {

        console.log(error);

        showError(
            "City not found"
        );

    } finally {

        showLoading(false);
    }
}


/* ==========================================
   EVENT LISTENERS
   ------------------------------------------
   Handles user interactions.
========================================== */

// Search button click
searchBtn.addEventListener(
    "click",
    handleSearch
);

// Press Enter to search
cityInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            handleSearch();
        }
    }
);

// Toggle temperature unit
unitBtn.addEventListener(
    "click",
    toggleUnit
);


/* ==========================================
   APP STARTUP
   ------------------------------------------
   Runs automatically when the page
   first loads.
========================================== */

// Display saved search history
renderHistory();

// Load weather for user's location
getUserLocationWeather();