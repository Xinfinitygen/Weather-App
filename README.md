# Weather-App

A functional Weather App that fetches and displays real live weather data from a free public API.

This project was developed as part of the AltSchool Africa School of Engineering First Semester Examination and demonstrates core frontend development concepts including API integration, asynchronous JavaScript, DOM manipulation, Local Storage, geolocation, responsive design, and state management.


## Student Information

**Name:** Ezekiel Okechukwu Promise  
**Student ID:** ALT/SOE/BAR/026/0081

---

## Project Description

This Weather App was built using HTML, CSS, and JavaScript, with weather data fetched from the Open-Meteo API. The application allows users to search for any city and view its current weather conditions, including temperature, humidity, wind speed, UV index, and a 5-day forecast. Additional features implemented include automatic weather detection based on the user's current location, search history stored in localStorage, a temperature unit toggle between Celsius and Fahrenheit without re-fetching data, and animated weather icons for a more engaging user experience. The user interface was designed to be responsive and mobile-friendly using CSS Flexbox and media queries.

---

## Challenges Faced During Development

Building this project came with several challenges. During the weather app implementation, I encountered a bug where searched weather results would briefly display and then automatically revert to the default weather information. This was caused by the geolocation function running again and overwriting the searched data. Debugging this required tracing function execution with console logs and restructuring how the application initialized weather data.

Another challenge was implementing search history using localStorage. Initially, the saved cities were not rendering correctly due to issues with localStorage data handling and dynamic button creation. I also had to carefully manage duplicate searches and limit the history to the last five cities as required.

The Celsius/Fahrenheit toggle feature introduced additional complexity because temperatures needed to be converted without making new API requests. To solve this, I stored the current weather data in memory and re-rendered the interface whenever the user switched units.

Finally, maintaining clean, readable, and well-commented code required reorganizing the project into logical sections, improving naming conventions, and documenting functions clearly. This helped make the code easier to understand, maintain, and debug throughout the development process.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Open-Meteo Geocoding API
- Open-Meteo Weather Forecast API
- LocalStorage
- Geolocation API

---

## Features Implemented

✅ Search weather by city name

✅ Current weather display

✅ 5-day weather forecast

✅ Error handling for invalid city names

✅ Loading state while fetching data

✅ Responsive design for mobile devices

✅ Current location weather using Geolocation API

✅ Search history with LocalStorage (last 5 cities)

✅ Celsius/Fahrenheit temperature toggle

✅ Animated weather icons

✅ Clean and documented code structure
