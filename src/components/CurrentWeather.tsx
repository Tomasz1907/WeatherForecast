import React from 'react';
import { WeatherData } from '../types';

const CurrentWeather = ({ weatherData, getWeatherDescription }: { weatherData: WeatherData | null, getWeatherDescription: (code: number, isDay: boolean) => string }) => {
  if (!weatherData) {
    return <div>Nie wybrano miejscowości</div>;
  }
  const currentHourIndex = new Date().getHours();
  const { temperature_2m, weather_code, surface_pressure, cloud_cover, wind_speed_10m } = weatherData.hourly;

  return (
    <div className='flex flex-col items-center gap-5'>
        <p className='text-xl font-bold'>Current Weather</p>
        <div className='flex flex-col items-center gap-5 border-4 rounded-xl p-5 min-w-[250px] bg-gradient-to-b from-sky-300/50 to-neutral-800'>
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