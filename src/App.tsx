import { useState, useEffect } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import WeekWeather from './components/WeekWeather';
import CurrentWeather from './components/CurrentWeather';
import { WeatherData } from './types';
import { weatherCodeDescriptions, dayEmojis, nightEmojis } from './weatherDescriptions';
import { getTranslation } from './utils/translation';
import './index.css'; // Import the CSS file

interface CityCoords {
  latitude: number;
  longitude: number;
}

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getWeatherDescription = (code: number, isDay: boolean): string => {
    const description = weatherCodeDescriptions[code] || 'Unknown weather code';
    const emoji = isDay ? dayEmojis[code] : nightEmojis[code];
    return `${emoji} ${description}`;
  };

  const handleCityCoords = (selectedCity: CityCoords): void => {
    setLatitude(selectedCity.latitude);
    setLongitude(selectedCity.longitude);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,surface_pressure,cloud_cover,wind_speed_10m`
          );
          const data = await response.json();
          if (data) {
            setWeatherData(data);
            setError(null);
          } else {
            setError(getTranslation('noWeatherData'));
          }
        } catch (error) {
          setError(getTranslation('errorFetchingWeather'));
          console.error('Error fetching weather data:', error);
        }
      } else {
        setError(getTranslation('noCitySelected'));
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  return (
    <div className='min-h-screen bg-blur text-white text-xl flex flex-col items-center p-5'>
      <div className='w-full flex flex-col items-center gap-5 '>
        <Header />
        <Search handleCityCoords={handleCityCoords} />
        {error && <div className='text-white font-bold'>{error}</div>}
        <CurrentWeather weatherData={weatherData} getWeatherDescription={getWeatherDescription} />
        <WeekWeather weatherData={weatherData} getWeatherDescription={getWeatherDescription} />
      </div>
    </div>
  );
};

export default App;