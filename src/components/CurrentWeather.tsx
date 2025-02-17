import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  getWeatherDescription: (code: number, isDay: boolean) => string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, getWeatherDescription }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!weatherData) {
    return null;
  }

  const { hourly, hourly_units } = weatherData;
  const currentHourIndex = currentTime.getHours();

  const currentWeather = {
    temperature: hourly.temperature_2m[currentHourIndex],
    weatherCode: hourly.weather_code[currentHourIndex],
    surfacePressure: hourly.surface_pressure[currentHourIndex],
    cloudCover: hourly.cloud_cover[currentHourIndex],
    windSpeed: hourly.wind_speed_10m[currentHourIndex],
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className='flex flex-col items-center w-full gap-5'>
      <p className='text-xl font-bold'>Current Weather</p>
      <div className='flex flex-col items-center gap-5 border-2 rounded-xl p-5 min-w-[220px] pb-10 bg-gradient-to-b from-sky-300/50 to-neutral-800 shadow-lg'>
        <div className='text-center bg-sky-800 p-2 rounded'>
          <p className='text-xl font-bold'>{formattedDate}</p>
          <p className='text-md'>{formattedTime}</p>
        </div>
        <div className='bg-neutral-900/50 p-2 rounded'>{getWeatherDescription(currentWeather.weatherCode, currentHourIndex >= 6 && currentHourIndex < 18)}</div>
        <div className='text-sm w-full'>
          <div className='flex flex-col items-center justify-between'>
            <p><i className="fa-solid fa-temperature-half mr-2"></i>{currentWeather.temperature} {hourly_units.temperature_2m}</p>
            <p><i className="fa-solid fa-cloud mr-2"></i>{currentWeather.cloudCover} {hourly_units.cloud_cover}</p>
            <p><i className="fa-solid fa-bars mr-2"></i>{currentWeather.surfacePressure} {hourly_units.surface_pressure}</p>
            <p><i className="fa-solid fa-wind mr-2"></i>{currentWeather.windSpeed} {hourly_units.wind_speed_10m}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;