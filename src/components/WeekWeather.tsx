import React from 'react';
import { WeatherData } from '../types';

const WeekWeather = ({ weatherData, getWeatherDescription }: { weatherData: WeatherData | null, getWeatherDescription: (code: number, isDay: boolean) => string }) => {
  if (!weatherData) {
    return <div>Nie wybrano miejscowości</div>;
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const dailyWeather = days.map((date, index) => {
    const dayIndex = index * 24;
    const dayHourIndex = dayIndex + 12;
    const nightHourIndex = dayIndex;

    const dayTemperature = weatherData.hourly.temperature_2m[dayHourIndex];
    const nightTemperature = weatherData.hourly.temperature_2m[nightHourIndex];
    const dayWeatherCode = weatherData.hourly.weather_code[dayHourIndex];
    const nightWeatherCode = weatherData.hourly.weather_code[nightHourIndex];
    const daySurfacePressure = weatherData.hourly.surface_pressure[dayHourIndex];
    const nightSurfacePressure = weatherData.hourly.surface_pressure[nightHourIndex];
    const dayCloudCover = weatherData.hourly.cloud_cover[dayHourIndex];
    const nightCloudCover = weatherData.hourly.cloud_cover[nightHourIndex];
    const dayWindSpeed = weatherData.hourly.wind_speed_10m[dayHourIndex];
    const nightWindSpeed = weatherData.hourly.wind_speed_10m[nightHourIndex];

    return {
      date,
      dayWeatherCode,
      nightWeatherCode,
      dayTemperature,
      nightTemperature,
      daySurfacePressure,
      nightSurfacePressure,
      dayCloudCover,
      nightCloudCover,
      dayWindSpeed,
      nightWindSpeed
    };
  });

  return (
    <div className='flex flex-col items-center gap-5 w-full'>
      <p className='text-xl font-bold'>Weekly Weather</p>
      <div className='flex flex-row items-center gap-2 overflow-x-auto w-full'>
        {dailyWeather.map((day, index) => (
          <div key={index} className='flex flex-col items-center gap-5 border-4 rounded-xl p-5 min-w-[250px] bg-gradient-to-b from-sky-300/50 to-neutral-800'>
            <div className='text-center'>
              <p className='text-xl font-bold'>{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p>{day.date.toLocaleDateString()}</p>
            </div>
            <div>{getWeatherDescription(day.dayWeatherCode, true)}</div>
            <div className='text-sm w-full'>
              <div className='flex flex-row items-center justify-between'>
                <p><i className="fa-solid fa-temperature-half mr-2"></i>{day.dayTemperature}°C</p>
                <p><i className="fa-solid fa-cloud mr-2"></i>{day.dayCloudCover}%</p>
              </div>
              <div className='flex flex-row items-center justify-between'>
                <p><i className="fa-solid fa-bars mr-2"></i>{day.daySurfacePressure} hPa</p>
                <p><i className="fa-solid fa-wind mr-2"></i>{day.dayWindSpeed} km/h</p>
              </div>
            </div>
            <div>{getWeatherDescription(day.nightWeatherCode, false)}</div>
            <div className='text-sm w-full'>
              <div className='flex flex-row items-center justify-between'>
                <p><i className="fa-solid fa-temperature-half mr-2"></i>{day.nightTemperature}°C</p>
                <p><i className="fa-solid fa-cloud mr-2"></i>{day.nightCloudCover}%</p>
              </div>
              <div className='flex flex-row items-center justify-between'>
                <p><i className="fa-solid fa-bars mr-2"></i>{day.nightSurfacePressure} hPa</p>
                <p><i className="fa-solid fa-wind mr-2"></i>{day.nightWindSpeed} km/h</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekWeather;