import { WeatherData } from "../types";
import { getTranslation } from "../utils/translation";

interface WeekWeatherProps {
  weatherData: WeatherData | null;
  getWeatherDescription: (code: number, isDay: boolean) => string;
  timezone: string;
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
  timezone,
}) => {
  if (!weatherData || !weatherData.hourly || !weatherData.hourly.time) {
    return null;
  }

  const { hourly, hourly_units } = weatherData;

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const localDateString = date.toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
    });
    const [datePart] = localDateString.split(", ");
    const [month, day, year] = datePart.split("/").map(Number);
    const baseDate = new Date(year, month - 1, day);
    baseDate.setDate(baseDate.getDate() + i);
    return baseDate;
  });

  const dailyWeather: DailyWeather[] = days.map((date, index) => {
    const dayIndex = index * 24;
    const dayHourIndex = dayIndex + 12;
    const nightHourIndex = dayIndex;

    return {
      date,
      dayWeatherCode:
        hourly.weather_code && hourly.weather_code[dayHourIndex] !== undefined
          ? hourly.weather_code[dayHourIndex]
          : 0,
      nightWeatherCode:
        hourly.weather_code && hourly.weather_code[nightHourIndex] !== undefined
          ? hourly.weather_code[nightHourIndex]
          : 0,
      dayTemperature:
        hourly.temperature_2m &&
        hourly.temperature_2m[dayHourIndex] !== undefined
          ? hourly.temperature_2m[dayHourIndex]
          : 0,
      nightTemperature:
        hourly.temperature_2m &&
        hourly.temperature_2m[nightHourIndex] !== undefined
          ? hourly.temperature_2m[nightHourIndex]
          : 0,
      daySurfacePressure:
        hourly.surface_pressure &&
        hourly.surface_pressure[dayHourIndex] !== undefined
          ? hourly.surface_pressure[dayHourIndex]
          : 0,
      nightSurfacePressure:
        hourly.surface_pressure &&
        hourly.surface_pressure[nightHourIndex] !== undefined
          ? hourly.surface_pressure[nightHourIndex]
          : 0,
      dayCloudCover:
        hourly.cloud_cover && hourly.cloud_cover[dayHourIndex] !== undefined
          ? hourly.cloud_cover[dayHourIndex]
          : 0,
      nightCloudCover:
        hourly.cloud_cover && hourly.cloud_cover[nightHourIndex] !== undefined
          ? hourly.cloud_cover[nightHourIndex]
          : 0,
      dayPrecipationProbability:
        hourly.precipitation_probability &&
        hourly.precipitation_probability[dayHourIndex] !== undefined
          ? hourly.precipitation_probability[dayHourIndex]
          : 0,
      nightPrecipationProbability:
        hourly.precipitation_probability &&
        hourly.precipitation_probability[nightHourIndex] !== undefined
          ? hourly.precipitation_probability[nightHourIndex]
          : 0,
      dayWindSpeed:
        hourly.wind_speed_10m &&
        hourly.wind_speed_10m[dayHourIndex] !== undefined
          ? hourly.wind_speed_10m[dayHourIndex]
          : 0,
      nightWindSpeed:
        hourly.wind_speed_10m &&
        hourly.wind_speed_10m[nightHourIndex] !== undefined
          ? hourly.wind_speed_10m[nightHourIndex]
          : 0,
    };
  });

  return (
    <div className="flex flex-col items-center w-full md:w-2/3 gap-10 bg-blue-500/20 p-2 rounded-lg">
      <p className="text-base sm:text-lg md:text-xl font-bold pt-2">
        {getTranslation("weeklyWeather")}
      </p>
      {dailyWeather.map((day, index) => (
        <div
          key={index}
          className="flex flex-col text-sm md:text-md w-full gap-2"
        >
          <div className="flex items-center justify-center gap-5 text-lg font-bold">
            <p>
              {day.date.toLocaleDateString(navigator.language, {
                weekday: "long",
                timeZone: timezone,
              })}
            </p>
            <p>
              {day.date.toLocaleDateString(navigator.language, {
                timeZone: timezone,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-blue-800/50 p-2 rounded-t">
            <p className="text-lg">
              {getWeatherDescription(day.dayWeatherCode, true).slice(0, 2)}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-temperature-half mr-1"></i>
              {day.dayTemperature} {hourly_units.temperature_2m}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-cloud mr-1"></i>
              {day.dayCloudCover} {hourly_units.cloud_cover}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-cloud-rain mr-1"></i>
              {day.dayPrecipationProbability}{" "}
              {hourly_units.precipitation_probability}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-bars mr-1"></i>
              {day.daySurfacePressure} {hourly_units.surface_pressure}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-wind mr-1"></i>
              {day.dayWindSpeed} {hourly_units.wind_speed_10m}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 bg-neutral-900/50 p-2 rounded-b">
            <p className="text-lg">
              {getWeatherDescription(day.nightWeatherCode, false).slice(0, 2)}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-temperature-half mr-1"></i>
              {day.nightTemperature} {hourly_units.temperature_2m}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-cloud mr-1"></i>
              {day.nightCloudCover} {hourly_units.cloud_cover}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-cloud-rain mr-1"></i>
              {day.nightPrecipationProbability}{" "}
              {hourly_units.precipitation_probability}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
              <i className="fa-solid fa-bars mr-1"></i>
              {day.nightSurfacePressure} {hourly_units.surface_pressure}
            </p>
            <p className="flex flex-col md:flex-row items-center justify-center gap-1">
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
