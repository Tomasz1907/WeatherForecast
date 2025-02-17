import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import WeekWeather from './components/WeekWeather';
import CurrentWeather from './components/CurrentWeather';
import { WeatherData } from './types';

const App = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const dayWeatherCodeDescriptions: { [key: number]: string } = {
    0: '☀️ Clear sky',
    1: '🌤️ Mainly clear',
    2: '⛅ Partly cloudy',
    3: '☁️ Overcast',
    45: '🌫️ Fog',
    48: '🌫️ Depositing rime fog',
    51: '🌧️ Light drizzle',
    53: '🌧️ Moderate drizzle',
    55: '🌧️ Dense drizzle',
    56: '🌧️ Light freezing drizzle',
    57: '🌧️ Dense freezing drizzle',
    61: '🌧️ Slight rain',
    63: '🌧️ Moderate rain',
    65: '🌧️ Heavy rain',
    66: '🌧️ Light freezing rain',
    67: '🌧️ Heavy freezing rain',
    71: '❄️ Slight snow fall',
    73: '❄️ Moderate snow fall',
    75: '❄️ Heavy snow fall',
    77: '❄️ Snow grains',
    80: '🌧️ Slight rain showers',
    81: '🌧️ Moderate rain showers',
    82: '🌧️ Violent rain showers',
    85: '❄️ Slight snow showers',
    86: '❄️ Heavy snow showers',
    95: '⛈️ Slight or moderate thunderstorm',
    96: '⛈️ Thunderstorm with slight hail',
    99: '⛈️ Thunderstorm with heavy hail'
  };

  const nightWeatherCodeDescriptions: { [key: number]: string } = {
    0: '🌕 Clear sky',
    1: '🌖 Mainly clear',
    2: '🌗 Partly cloudy',
    3: '🌘 Overcast',
    45: '🌫️ Fog',
    48: '🌫️ Depositing rime fog',
    51: '🌧️ Light drizzle',
    53: '🌧️ Moderate drizzle',
    55: '🌧️ Dense drizzle',
    56: '🌧️ Light freezing drizzle',
    57: '🌧️ Dense freezing drizzle',
    61: '🌧️ Slight rain',
    63: '🌧️ Moderate rain',
    65: '🌧️ Heavy rain',
    66: '🌧️ Light freezing rain',
    67: '🌧️ Heavy freezing rain',
    71: '❄️ Slight snow fall',
    73: '❄️ Moderate snow fall',
    75: '❄️ Heavy snow fall',
    77: '❄️ Snow grains',
    80: '🌧️ Slight rain showers',
    81: '🌧️ Moderate rain showers',
    82: '🌧️ Violent rain showers',
    85: '❄️ Slight snow showers',
    86: '❄️ Heavy snow showers',
    95: '⛈️ Slight or moderate thunderstorm',
    96: '⛈️ Thunderstorm with slight hail',
    99: '⛈️ Thunderstorm with heavy hail'
  };

  const getWeatherDescription = (code: number, isDay: boolean): string => {
    return isDay ? dayWeatherCodeDescriptions[code] || 'Unknown weather code' : nightWeatherCodeDescriptions[code] || 'Unknown weather code';
  };

  interface CityCoords {
    latitude: number;
    longitude: number;
  }

  const handleCityCoords = (selectedCity: CityCoords) => {
    setLatitude(selectedCity.latitude);
    setLongitude(selectedCity.longitude);
  };

  console.log(latitude, longitude);

  useEffect(() => {
    if (latitude && longitude) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,surface_pressure,cloud_cover,wind_speed_10m`)
        .then((res) => res.json())
        .then(data => {
          if (data) {
            setWeatherData(data);
          } else {
            console.log(`No weather data`);
          }
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    } else {
      console.log('No city selected');
    }
  }, [latitude, longitude]);

  return (
    <div className='min-h-screen bg-sky-500 text-white text-xl flex flex-col items-center p-5'>
      <div className='w-full flex flex-col items-center gap-5'>
        <Header />
        <Search handleCityCoords={handleCityCoords} />
        <CurrentWeather weatherData={weatherData} getWeatherDescription={getWeatherDescription}/>
        <WeekWeather weatherData={weatherData} getWeatherDescription={getWeatherDescription}/>
      </div>
    </div>
  );
};

export default App;