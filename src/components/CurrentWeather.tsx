import { useState, useEffect } from "react";
import { WeatherData } from "../types";
import { getTranslation } from "../utils/translation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  getWeatherDescription: (code: number, isDay: boolean) => string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weatherData,
  getWeatherDescription,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<
    "tempPrecip" | "pressure" | "wind"
  >("tempPrecip");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!weatherData || !weatherData.hourly) {
    return (
      <div className="w-full text-center text-sm md:text-md">
        {getTranslation("noWeatherData")}
      </div>
    );
  }

  const { hourly, hourly_units } = weatherData;
  const currentHourIndex = currentTime.getHours();
  const predictionHours = 6;
  const currentWeather = {
    temperature:
      hourly.temperature_2m &&
      hourly.temperature_2m[currentHourIndex] !== undefined
        ? hourly.temperature_2m[currentHourIndex]
        : 0,
    weatherCode:
      hourly.weather_code && hourly.weather_code[currentHourIndex] !== undefined
        ? hourly.weather_code[currentHourIndex]
        : 0,
    surfacePressure:
      hourly.surface_pressure &&
      hourly.surface_pressure[currentHourIndex] !== undefined
        ? hourly.surface_pressure[currentHourIndex]
        : 0,
    cloudCover:
      hourly.cloud_cover && hourly.cloud_cover[currentHourIndex] !== undefined
        ? hourly.cloud_cover[currentHourIndex]
        : 0,
    precipitationProbability:
      hourly.precipitation_probability &&
      hourly.precipitation_probability[currentHourIndex] !== undefined
        ? hourly.precipitation_probability[currentHourIndex]
        : 0,
    windSpeed:
      hourly.wind_speed_10m &&
      hourly.wind_speed_10m[currentHourIndex] !== undefined
        ? hourly.wind_speed_10m[currentHourIndex]
        : 0,
  };

  const hours = Array.from(
    { length: currentHourIndex + 1 + predictionHours },
    (_, i) => {
      const hour = i % 24;
      return hour.toString().padStart(2, "0") + ":00";
    }
  );

  const getActualAndPredictedData = (
    data: number[] | undefined,
    actualEndIndex: number,
    predictionLength: number
  ) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return Array(actualEndIndex + 1 + predictionLength).fill(0);
    }

    const actual = data.slice(0, actualEndIndex + 1);
    const predicted = data.slice(
      actualEndIndex + 1,
      actualEndIndex + 1 + predictionLength
    );

    if (predicted.length < predictionLength && actual.length >= 2) {
      const last = actual[actual.length - 1] || 0;
      const secondLast = actual[actual.length - 2] || 0;
      const slope = last - secondLast;
      const extrapolated = Array(predictionLength - predicted.length)
        .fill(0)
        .map((_, i) => last + slope * (i + 1));
      return [...actual, ...predicted, ...extrapolated].slice(
        0,
        actualEndIndex + 1 + predictionLength
      );
    }
    return [
      ...actual,
      ...predicted,
      ...Array(predictionLength - predicted.length).fill(
        actual[actual.length - 1] || 0
      ),
    ].slice(0, actualEndIndex + 1 + predictionLength);
  };

  const getLineData = () => {
    const combinedData = {
      temperature: getActualAndPredictedData(
        hourly.temperature_2m,
        currentHourIndex,
        predictionHours
      ),
      precipitationProbability: getActualAndPredictedData(
        hourly.precipitation_probability,
        currentHourIndex,
        predictionHours
      ),
      surfacePressure: getActualAndPredictedData(
        hourly.surface_pressure,
        currentHourIndex,
        predictionHours
      ),
      windSpeed: getActualAndPredictedData(
        hourly.wind_speed_10m,
        currentHourIndex,
        predictionHours
      ),
    };

    switch (activeTab) {
      case "tempPrecip":
        return {
          labels: hours,
          datasets: [
            {
              label: `${getTranslation("tempPrecipTab").split(" & ")[0]} (${
                hourly_units?.temperature_2m || "°C"
              })`,
              data: combinedData.temperature,
              borderColor: "rgba(255, 0, 0, 1)",
              backgroundColor: "rgba(255, 0, 0, 0.3)",
              fill: "origin",
              yAxisID: "y-temp",
              tension: 0.3,
              pointRadius: 3,
              segment: {
                borderDash: (ctx: any) =>
                  ctx.p1DataIndex > currentHourIndex ? [5, 5] : undefined,
              },
            },
            {
              label: `${getTranslation("precipitation")} (${
                hourly_units?.precipitation_probability || "%"
              })`,
              data: combinedData.precipitationProbability,
              borderColor: "rgba(0, 0, 255, 1)",
              backgroundColor: "rgba(0, 0, 255, 0.3)",
              fill: "origin",
              yAxisID: "y-percent",
              tension: 0.3,
              pointRadius: 3,
              segment: {
                borderDash: (ctx: any) =>
                  ctx.p1DataIndex > currentHourIndex ? [5, 5] : undefined,
              },
            },
          ],
        };
      case "pressure":
        return {
          labels: hours,
          datasets: [
            {
              label: `${getTranslation("pressureTab")} (${
                hourly_units?.surface_pressure || "hPa"
              })`,
              data: combinedData.surfacePressure,
              borderColor: "rgba(0, 128, 0, 1)",
              backgroundColor: "rgba(0, 128, 0, 0.3)",
              fill: "origin",
              yAxisID: "y-pressure",
              tension: 0.3,
              pointRadius: 3,
              segment: {
                borderDash: (ctx: any) =>
                  ctx.p1DataIndex > currentHourIndex ? [5, 5] : undefined,
              },
            },
          ],
        };
      case "wind":
        return {
          labels: hours,
          datasets: [
            {
              label: `${getTranslation("windSpeedTab")} (${
                hourly_units?.wind_speed_10m || "km/h"
              })`,
              data: combinedData.windSpeed,
              borderColor: "rgba(128, 0, 128, 1)",
              backgroundColor: "rgba(128, 0, 128, 0.3)",
              fill: "origin",
              yAxisID: "y-wind",
              tension: 0.3,
              pointRadius: 3,
              segment: {
                borderDash: (ctx: any) =>
                  ctx.p1DataIndex > currentHourIndex ? [5, 5] : undefined,
              },
            },
          ],
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          title: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex;
            return index > currentHourIndex
              ? `${hours[index]} (${getTranslation("predicted")})`
              : hours[index];
          },
        },
      },
      filler: {
        propagate: true,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
      },
      "y-temp": {
        type: "linear" as const,
        display: activeTab === "tempPrecip",
        position: "left" as const,
        title: {
          display: true,
          text: `${getTranslation("tempPrecipTab").split(" & ")[0]} (${
            hourly_units?.temperature_2m || "°C"
          })`,
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
      },
      "y-percent": {
        type: "linear" as const,
        display: activeTab === "tempPrecip",
        position: "right" as const,
        title: {
          display: true,
          text: `${getTranslation("precipitation")} (${
            hourly_units?.precipitation_probability || "%"
          })`,
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        grid: { drawOnChartArea: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        min: 0,
        max: 100,
      },
      "y-pressure": {
        type: "linear" as const,
        display: activeTab === "pressure",
        position: "left" as const,
        title: {
          display: true,
          text: `${getTranslation("pressureTab")} (${
            hourly_units?.surface_pressure || "hPa"
          })`,
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
      },
      "y-wind": {
        type: "linear" as const,
        display: activeTab === "wind",
        position: "left" as const,
        title: {
          display: true,
          text: `${getTranslation("windSpeedTab")} (${
            hourly_units?.wind_speed_10m || "km/h"
          })`,
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: { size: 10 },
        },
        min: 0,
      },
    },
  };

  const formattedDate = currentTime.toLocaleDateString(navigator.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col items-center w-full md:w-2/3 gap-4 sm:gap-5 p-3 sm:p-5 bg-blue-500/20 rounded-lg">
      <div className="flex flex-col w-full items-center justify-center gap-2">
        <p className="text-base sm:text-lg md:text-xl font-bold">
          {formattedDate}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl font-mono">
          {formattedTime}
        </p>
      </div>
      <p className="text-base sm:text-lg md:text-xl font-bold">
        {getTranslation("currentWeather")}
      </p>
      <div className="w-full flex items-center justify-center gap-3 sm:gap-5 bg-blue-500/20 p-3 sm:p-5 rounded-lg">
        <p className="text-sm md:text-lg">
          {getWeatherDescription(
            currentWeather.weatherCode,
            currentHourIndex >= 6 && currentHourIndex < 18
          )}
        </p>
        <p className="text-sm md:text-lg">
          <i className="fa-solid fa-temperature-half mr-1 sm:mr-2"></i>
          {currentWeather.temperature} {hourly_units?.temperature_2m || "°C"}
        </p>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-3 sm:gap-5 text-xs sm:text-sm">
        <p className="flex flex-col sm:flex-row items-center gap-1">
          <i className="fa-solid fa-cloud mr-1 sm:mr-2"></i>
          {currentWeather.cloudCover} {hourly_units?.cloud_cover || "%"}
        </p>
        <p className="flex flex-col sm:flex-row items-center gap-1">
          <i className="fa-solid fa-cloud-rain mr-1 sm:mr-2"></i>
          {currentWeather.precipitationProbability}{" "}
          {hourly_units?.precipitation_probability || "%"}
        </p>
        <p className="flex flex-col sm:flex-row items-center gap-1">
          <i className="fa-solid fa-bars mr-1 sm:mr-2"></i>
          {currentWeather.surfacePressure}{" "}
          {hourly_units?.surface_pressure || "hPa"}
        </p>
        <p className="flex flex-col sm:flex-row items-center gap-1">
          <i className="fa-solid fa-wind mr-1 sm:mr-2"></i>
          {currentWeather.windSpeed} {hourly_units?.wind_speed_10m || "km/h"}
        </p>
      </div>
      <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 bg-neutral-800/50 rounded-lg">
        <div className="w-full flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
          <button
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded ${
              activeTab === "tempPrecip"
                ? "bg-blue-500 text-white"
                : "bg-neutral-800/50 text-gray-300 hover:bg-neutral-800"
            }`}
            onClick={() => setActiveTab("tempPrecip")}
          >
            {getTranslation("tempPrecipTab")}
          </button>
          <button
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded ${
              activeTab === "pressure"
                ? "bg-blue-500 text-white"
                : "bg-neutral-800/50 text-gray-300 hover:bg-neutral-800"
            }`}
            onClick={() => setActiveTab("pressure")}
          >
            {getTranslation("pressureTab")}
          </button>
          <button
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded ${
              activeTab === "wind"
                ? "bg-blue-500 text-white"
                : "bg-neutral-800/50 text-gray-300 hover:bg-neutral-800"
            }`}
            onClick={() => setActiveTab("wind")}
          >
            {getTranslation("windSpeedTab")}
          </button>
        </div>
        <div className="w-full h-[40vh] sm:h-[50vh] min-h-[250px]">
          <Line data={getLineData()} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
