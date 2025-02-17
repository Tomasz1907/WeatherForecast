import { WeatherData } from '../types';
import { getTranslation } from '../utils/translation';

interface WeekWeatherProps {
  weatherData: WeatherData | null;
  getWeatherDescription: (code: number, isDay: boolean) => string;
}

interface DailyWeather {
  date: Date;
  dayWeatherCode: number;
  nightWeatherCode: number;
  dayTemperature: number;
  nightTemperature: number;
  daySurfacePressure: number;
  nightSurfacePressure: number;
  dayCloudCover: number;
  nightCloudCover: number;
  dayPrecipationProbability: number;
  nightPrecipationProbability: number
  dayWindSpeed: number;
  nightWindSpeed: number;
}

const WeekWeather: React.FC<WeekWeatherProps> = ({ weatherData, getWeatherDescription }) => {
  if (!weatherData) {
    return null;
  }

  const { hourly, hourly_units } = weatherData;

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const dailyWeather: DailyWeather[] = days.map((date, index) => {
    const dayIndex = index * 24;
    const dayHourIndex = dayIndex + 12;
    const nightHourIndex = dayIndex;

    return {
      date,
      dayWeatherCode: hourly.weather_code[dayHourIndex],
      nightWeatherCode: hourly.weather_code[nightHourIndex],
      dayTemperature: hourly.temperature_2m[dayHourIndex],
      nightTemperature: hourly.temperature_2m[nightHourIndex],
      daySurfacePressure: hourly.surface_pressure[dayHourIndex],
      nightSurfacePressure: hourly.surface_pressure[nightHourIndex],
      dayCloudCover: hourly.cloud_cover[dayHourIndex],
      nightCloudCover: hourly.cloud_cover[nightHourIndex],
      dayPrecipationProbability: hourly.precipitation_probability[dayHourIndex],
      nightPrecipationProbability: hourly.precipitation_probability[nightHourIndex],
      dayWindSpeed: hourly.wind_speed_10m[dayHourIndex],
      nightWindSpeed: hourly.wind_speed_10m[nightHourIndex],
    };
  });

  return (
    <div className='flex flex-col items-center w-full gap-5'>
      <p className='text-xl font-bold'>{getTranslation('weeklyWeather')}</p>
      <div className='flex flex-row items-center gap-2 overflow-x-auto w-full p-4 bg-neutral-900/20 rounded'>
        {dailyWeather.map((day, index) => (
          <div key={index} className='flex flex-col mx-auto items-center justify-center gap-5 border-2 rounded-xl p-5 min-w-[220px] min-h-150 bg-gradient-to-b from-sky-300/50 to-neutral-800 shadow-lg'>
            <div className='text-center bg-sky-800 p-2 rounded'>
              <p className='text-xl font-bold'>{day.date.toLocaleDateString(navigator.language, { weekday: 'long' })}</p>
              <p className='text-md'>{day.date.toLocaleDateString()}</p>
            </div>
            <div className='bg-neutral-900/50 p-2 rounded text-center'>{getWeatherDescription(day.dayWeatherCode, true)}</div>
            <div className='text-sm w-full'>
              <div className='flex flex-col items-center justify-between gap-2'>
                <p><i className="fa-solid fa-temperature-half mr-2"></i>{day.dayTemperature} {hourly_units.temperature_2m}</p>
                <p><i className="fa-solid fa-cloud mr-2"></i>{day.dayCloudCover} {hourly_units.cloud_cover}</p>
                <p><i className="fa-solid fa-cloud-rain mr-2"></i>{day.dayPrecipationProbability} {hourly_units.precipitation_probability}</p>
                <p><i className="fa-solid fa-bars mr-2"></i>{day.daySurfacePressure} {hourly_units.surface_pressure}</p>
                <p><i className="fa-solid fa-wind mr-2"></i>{day.dayWindSpeed} {hourly_units.wind_speed_10m}</p>
              </div>
            </div>
            <div className='bg-neutral-900/50 p-2 rounded text-center'>{getWeatherDescription(day.nightWeatherCode, false)}</div>
            <div className='text-sm w-full'>
              <div className='flex flex-col items-center justify-between gap-2'>
                <p><i className="fa-solid fa-temperature-half mr-2"></i>{day.nightTemperature} {hourly_units.temperature_2m}</p>
                <p><i className="fa-solid fa-cloud mr-2"></i>{day.nightCloudCover} {hourly_units.cloud_cover}</p>
                <p><i className="fa-solid fa-cloud-rain mr-2"></i>{day.nightPrecipationProbability} {hourly_units.precipitation_probability}</p>
                <p><i className="fa-solid fa-bars mr-2"></i>{day.nightSurfacePressure} {hourly_units.surface_pressure}</p>
                <p><i className="fa-solid fa-wind mr-2"></i>{day.nightWindSpeed} {hourly_units.wind_speed_10m}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekWeather;