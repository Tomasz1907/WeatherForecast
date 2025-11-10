# Weather Forecast App

A modern, responsive weather application built with **React**, **Tailwind CSS** and **Free APIs**.  
Users can search for **any city worldwide** or **their location**.
View **current conditions**, **hourly forecasts**, and a **7-day outlook**.  
Bilingual translation: **English** and **Polish**.

---

## Live Demo

[https://tomasz1907-weather-forecast.web.app/](https://tomasz1907-weather-forecast.web.app/)

---

## Features

| Feature                   | Description                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| **City Search**           | Autocomplete powered by **Open-Meteo Geocoding API**                                              |
| **Real-time Clock**       | Local time updated every second in selected city’s timezone                                       |
| **Current Weather**       | Temperature, cloud cover, precipitation probability, pressure, wind speed                         |
| **Hourly Forecast (6 h)** | Interactive **Chart.js** line charts with tabs: Temperature & Precipitation, Pressure, Wind Speed |
| **7-Day Forecast**        | Day & night details for each day (temperature, weather, wind, etc.)                               |
| **Geolocation**           | Detects user location via browser geolocation                                                     |
| **Bilingual Interface**   | English & Polish - based on browser settings                                                      |
| **Responsive Design**     | Mobile-first, works on all screen sizes                                                           |

---

## Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** – utility-first styling
- **Vite** – fast build tool
- **Chart.js** + **react-chartjs-2** – interactive graphs
- **Font Awesome** – icons
- **Google Fonts** – `Pacifico` (logo), `DM Sans`, `Roboto`
- **Open-Meteo API** – free weather & geocoding data
- **Firebase** - app hosted for free on Firebase.

---

## APIs Used

| API                                              | Purpose                             |
| ------------------------------------------------ | ----------------------------------- |
| `https://api.open-meteo.com/v1/forecast`         | Weather data (hourly & daily)       |
| `https://geocoding-api.open-meteo.com/v1/search` | City search autocomplete            |
| `https://nominatim.openstreetmap.org/reverse`    | Reverse geocoding (location button) |

> No API keys required – all free and public

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Tomasz1907/WeatherForecast.git
cd WeatherForecast

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Screenshots

| #                                                                    | Description                         |
| -------------------------------------------------------------------- | ----------------------------------- |
| ![Search & Current Weather](./public/screenshots/search-current.png) | **Search bar + current conditions** |
| ![Hourly Chart](./public/screenshots/hourly-chart.png)               | **Hourly forecast with Chart.js**   |
| ![7-Day Forecast](./public/screenshots/week-forecast.png)            | **7-day day/night details**         |
