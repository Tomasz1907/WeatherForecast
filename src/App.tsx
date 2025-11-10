import { useState, useEffect } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import WeekWeather from "./components/WeekWeather";
import CurrentWeather from "./components/CurrentWeather";
import { WeatherData } from "./types";
import {
  weatherCodeDescriptions,
  dayEmojis,
  nightEmojis,
} from "./weatherDescriptions";
import { getTranslation } from "./utils/translation";
import "./index.css";
import Footer from "./components/Footer";

interface CityCoords {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [timezone, setTimezone] = useState<string>("GMT");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getWeatherDescription = (code: number, isDay: boolean): string => {
    const description = weatherCodeDescriptions[code] || "Unknown weather code";
    const emoji = isDay ? dayEmojis[code] : nightEmojis[code];
    return `${emoji} ${description}`;
  };

  const handleCityCoords = (selectedCity: CityCoords): void => {
    setLatitude(selectedCity.latitude);
    setLongitude(selectedCity.longitude);
    setTimezone(selectedCity.timezone || "GMT");
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,surface_pressure,cloud_cover,precipitation_probability,wind_speed_10m&timezone=${encodeURIComponent(
              timezone
            )}`
          );
          const data = await response.json();
          if (data) {
            setWeatherData(data);
            setError(null);
          } else {
            setError(getTranslation("noWeatherData"));
          }
        } catch (error) {
          setError(getTranslation("errorFetchingWeather"));
          console.error("Error fetching weather data:", error);
        }
      } else {
        setError(getTranslation("noCitySelected"));
      }
    };

    fetchWeatherData();
  }, [latitude, longitude, timezone]);

  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-blue-950 to-neutral-300">
      <Header />
      <div className="flex-1 p-2 md:p-5 space-y-5 w-full">
        <Search handleCityCoords={handleCityCoords} />
        {error && (
          <div className="text-center font-bold text-lg md:text-xl">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center">
          <CurrentWeather
            weatherData={weatherData}
            getWeatherDescription={getWeatherDescription}
            timezone={timezone}
          />
          <WeekWeather
            weatherData={weatherData}
            getWeatherDescription={getWeatherDescription}
            timezone={timezone}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
