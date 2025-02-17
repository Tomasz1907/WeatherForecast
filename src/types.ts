export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  wind_speed_10m: number[];
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
  surface_pressure: string;
  cloud_cover: string;
  wind_speed_10m: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly: HourlyData;
  hourly_units: HourlyUnits;
}