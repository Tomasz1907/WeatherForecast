import { WeatherData } from "../types";
import { getTranslation } from "../utils/translation";

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
  nightPrecipationProbability: number;
  dayWindSpeed: number;
  nightWindSpeed: number;
}

const WeekWeather: React.FC<WeekWeatherProps> = ({
  weatherData,
  getWeatherDescription,
}) => {
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
      nightPrecipationProbability:
        hourly.precipitation_probability[nightHourIndex],
      dayWindSpeed: hourly.wind_speed_10m[dayHourIndex],
      nightWindSpeed: hourly.wind_speed_10m[nightHourIndex],
    };
  });

  return (
    <div className="flex flex-col items-center w-full md:w-2/3 gap-10 bg-indigo-500/40 p-2 rounded-lg">
      <p className="text-xl font-bold">{getTranslation("weeklyWeather")}</p>
      {dailyWeather.map((day, index) => (
        <div
          key={index}
          className="flex flex-col text-sm md:text-md w-full gap-2"
        >
          <div className="flex items-center justify-center gap-5 text-lg font-bold">
            <p>
              {day.date.toLocaleDateString(navigator.language, {
                weekday: "long",
              })}
            </p>
            <p>{day.date.toLocaleDateString()}</p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-blue-800/50 p-2 rounded-t">
            <p className="text-lg">
              {getWeatherDescription(day.dayWeatherCode, true).slice(0, 2)}
            </p>
            <p>
              <i className="fa-solid fa-temperature-half mr-1"></i>
              {day.dayTemperature} {hourly_units.temperature_2m}
            </p>
            <p>
              <i className="fa-solid fa-cloud mr-1"></i>
              {day.dayCloudCover} {hourly_units.cloud_cover}
            </p>
            <p>
              <i className="fa-solid fa-cloud-rain mr-1"></i>
              {day.dayPrecipationProbability}{" "}
              {hourly_units.precipitation_probability}
            </p>
            <p>
              <i className="fa-solid fa-bars mr-1"></i>
              {day.daySurfacePressure} {hourly_units.surface_pressure}
            </p>
            <p>
              <i className="fa-solid fa-wind mr-1"></i>
              {day.dayWindSpeed} {hourly_units.wind_speed_10m}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-neutral-900/50 p-2 rounded-b">
            <p className="text-lg">
              {getWeatherDescription(day.nightWeatherCode, false).slice(0, 2)}
            </p>
            <p>
              <i className="fa-solid fa-temperature-half mr-1"></i>
              {day.nightTemperature} {hourly_units.temperature_2m}
            </p>
            <p>
              <i className="fa-solid fa-cloud mr-1"></i>
              {day.nightCloudCover} {hourly_units.cloud_cover}
            </p>
            <p>
              <i className="fa-solid fa-cloud-rain mr-1"></i>
              {day.nightPrecipationProbability}{" "}
              {hourly_units.precipitation_probability}
            </p>
            <p>
              <i className="fa-solid fa-bars mr-1"></i>
              {day.nightSurfacePressure} {hourly_units.surface_pressure}
            </p>
            <p>
              <i className="fa-solid fa-wind mr-1"></i>
              {day.nightWindSpeed} {hourly_units.wind_speed_10m}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekWeather;
