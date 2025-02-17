import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

const CurrentWeather = ({ weatherData, getWeatherDescription }: { weatherData: WeatherData | null, getWeatherDescription: (code: number, isDay: boolean) => string }) => {
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

  const currentHourIndex = currentTime.getHours();
  const { temperature_2m, weather_code, surface_pressure, cloud_cover, wind_speed_10m } = weatherData.hourly;

  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className='flex flex-col items-center gap-5'>
      <p className='text-xl font-bold'>Current Weather</p>
      <div className='flex flex-col items-center gap-5 border-4 rounded-xl py-5 px-2 min-w-[220px] md:px-10 bg-gradient-to-b from-sky-300/50 to-neutral-800 shadow-lg'>
      <div className='flex flex-col items-center gap-1 bg-neutral-900/50 p-5 rounded-xl shadow-lg'>
        <div className='text-lg'>{formattedTime}</div>
        <div className='text-sm'>{formattedDate}</div>
      </div>
        <p className='text-2xl'>{getWeatherDescription(weather_code[currentHourIndex], currentHourIndex >= 6 && currentHourIndex < 18)}</p>
        <div><i className="fa-solid fa-temperature-half mr-2"></i> {temperature_2m[currentHourIndex]}°C</div>
        <div><i className="fa-solid fa-cloud mr-2"></i>{cloud_cover[currentHourIndex]}%</div>
        <div><i className="fa-solid fa-bars mr-2"></i>{surface_pressure[currentHourIndex]} hPa</div>
        <div><i className="fa-solid fa-wind mr-2"></i>{wind_speed_10m[currentHourIndex]} km/h</div>
      </div>
    </div>
  );
}

export default CurrentWeather;