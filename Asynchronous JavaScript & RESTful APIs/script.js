"use strict";


/* =====================================================
   TASK 04
   ASYNCHRONOUS JAVASCRIPT & RESTFUL APIs
   ===================================================== */


/*
 * Public REST API
 * No API key required.
 */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* ---------- DOM ELEMENTS ---------- */

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const searchButton =
    document.getElementById("search-button");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const weatherResult =
    document.getElementById("weather-result");

const cityName =
    document.getElementById("city-name");

const weatherCondition =
    document.getElementById("weather-condition");

const temperature =
    document.getElementById("temperature");

const temperatureDetail =
    document.getElementById("temperature-detail");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");


/* ---------- WEATHER CODE DESCRIPTION ----- */

const weatherDescriptions = {

    0: "Clear sky",

    1: "Mainly clear",

    2: "Partly cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Rime fog",

    51: "Light drizzle",

    53: "Moderate drizzle",

    55: "Dense drizzle",

    56: "Light freezing drizzle",

    57: "Dense freezing drizzle",

    61: "Slight rain",

    63: "Moderate rain",

    65: "Heavy rain",

    66: "Light freezing rain",

    67: "Heavy freezing rain",

    71: "Slight snow",

    73: "Moderate snow",

    75: "Heavy snow",

    77: "Snow grains",

    80: "Slight rain showers",

    81: "Moderate rain showers",

    82: "Heavy rain showers",

    85: "Slight snow showers",

    86: "Heavy snow showers",

    95: "Thunderstorm",

    96: "Thunderstorm with hail",

    99: "Thunderstorm with heavy hail"

};


/* =====================================================
   FORM EVENT
   ===================================================== */

weatherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();


        if (!city) {

            showError(
                "Please enter a city name."
            );

            return;

        }


        await searchWeather(city);

    }
);


/* =====================================================
   MAIN WEATHER FUNCTION
   ===================================================== */

async function searchWeather(city) {

    setLoading(true);

    clearError();


    try {

        /*
         * Step 1:
         * Search city and get coordinates.
         */

        const location =
            await getCoordinates(city);


        /*
         * Step 2:
         * Fetch real-time weather JSON.
         */

        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );


        /*
         * Step 3:
         * Dynamically render JSON data.
         */

        displayWeather(
            location,
            weather
        );

    }

    catch (error) {

        console.error(
            "Weather request failed:",
            error
        );


        showError(
            error.message ||
            "Unable to retrieve weather data."
        );

    }

    finally {

        setLoading(false);

    }

}


/* =====================================================
   GEOCODING API
   ===================================================== */

async function getCoordinates(city) {

    const url =
        `${GEOCODING_API}` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;


    let response;


    try {

        response =
            await fetch(url);

    }

    catch {

        throw new Error(
            "Network error. Please check your internet connection."
        );

    }


    /*
     * HTTP error handling
     */

    if (!response.ok) {

        throw new Error(
            `Location request failed (${response.status}).`
        );

    }


    /*
     * Parse JSON response
     */

    const data =
        await response.json();


    /*
     * Check whether city exists
     */

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" could not be found.`
        );

    }


    return data.results[0];

}


/* =====================================================
   WEATHER REST API
   ===================================================== */

async function getWeather(
    latitude,
    longitude
) {

    const url =
        `${WEATHER_API}` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&timezone=auto`;


    let response;


    try {

        response =
            await fetch(url);

    }

    catch {

        throw new Error(
            "Unable to connect to the weather service."
        );

    }


    /*
     * Comprehensive HTTP error handling
     */

    if (!response.ok) {

        throw new Error(
            `Weather request failed (${response.status}).`
        );

    }


    /*
     * Convert response to JSON
     */

    const data =
        await response.json();


    /*
     * Validate returned JSON
     */

    if (!data.current) {

        throw new Error(
            "Weather service returned incomplete data."
        );

    }


    return data;

}


/* =====================================================
   DYNAMIC DOM RENDERING
   ===================================================== */

function displayWeather(
    location,
    weather
) {

    const current =
        weather.current;


    /*
     * City
     */

    cityName.textContent =
        `${location.name}, ${location.country}`;


    /*
     * Weather condition
     */

    weatherCondition.textContent =
        weatherDescriptions[
            current.weather_code
        ] ||
        "Weather information available";


    /*
     * Temperature
     */

    const currentTemperature =
        Math.round(
            current.temperature_2m
        );


    temperature.textContent =
        currentTemperature;


    temperatureDetail.textContent =
        `${currentTemperature} °C`;


    /*
     * Humidity
     */

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    /*
     * Wind speed
     */

    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;


    /*
     * Show weather section
     */

    weatherResult.classList.remove(
        "hidden"
    );

}


/* =====================================================
   LOADING STATE
   ===================================================== */

function setLoading(isLoading) {

    loading.classList.toggle(
        "hidden",
        !isLoading
    );


    searchButton.disabled =
        isLoading;


    searchButton.textContent =
        isLoading
            ? "Loading..."
            : "Search";

}


/* =====================================================
   ERROR HANDLING
   ===================================================== */

function showError(message) {

    errorMessage.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    weatherResult.classList.add(
        "hidden"
    );

}


function clearError() {

    errorMessage.textContent =
        "";

    errorMessage.classList.add(
        "hidden"
    );

}


/* ---------- INITIAL FOCUS ---------- */

cityInput.focus();