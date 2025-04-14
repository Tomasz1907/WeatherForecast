import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { getTranslation } from "../utils/translation";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface SearchProps {
  handleCityCoords: (city: City) => void;
}

const Search: React.FC<SearchProps> = ({ handleCityCoords }) => {
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [debouncedCity, setDebouncedCity] = useState<string>("");
  const [listHidden, setListHidden] = useState<boolean>(true);

  useDebounce(() => setDebouncedCity(city), 500, [city]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedCity}`
        );
        const data = await response.json();
        if (data.results) {
          const updatedCities = data.results.map((result: any) => ({
            ...result,
            timezone: result.timezone || "GMT",
          }));
          setCities(updatedCities);
          const cityName = debouncedCity.split(",")[0].trim();
          setListHidden(updatedCities.some((c: City) => c.name === cityName));
        } else {
          setCities([]);
          setListHidden(true);
        }
      } catch (error) {
        console.error(getTranslation("errorFetchingCityData"), error);
        setCities([]);
      }
    };

    if (debouncedCity) {
      fetchCities();
    } else {
      setCities([]);
    }
  }, [debouncedCity]);

  const handleCitySelect = (selectedCity: City) => {
    setCity(`${selectedCity.name}, ${selectedCity.country}`);
    setListHidden(true);
    handleCityCoords({
      ...selectedCity,
      timezone: selectedCity.timezone || "GMT",
    });
  };

  const handleGetLocalization = () => {
    if (!navigator.geolocation) {
      setCity(getTranslation("localizationNot"));
      setCities([]);
      setListHidden(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const reverseResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const { address } = await reverseResponse.json();
          const cityName = address?.city || address?.town || address?.village;

          if (!cityName) {
            setCity(getTranslation("localizationNot"));
            setCities([]);
            setListHidden(true);
            return;
          }

          const searchResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              cityName
            )}&count=10`
          );
          const { results } = await searchResponse.json();

          if (!results?.length) {
            setCity(getTranslation("localizationNot"));
            setCities([]);
            setListHidden(true);
            return;
          }

          const closestCity = results.reduce((closest: any, current: any) => {
            const closestDist = Math.sqrt(
              Math.pow(closest.latitude - latitude, 2) +
                Math.pow(closest.longitude - longitude, 2)
            );
            const currentDist = Math.sqrt(
              Math.pow(current.latitude - latitude, 2) +
                Math.pow(current.longitude - longitude, 2)
            );
            return currentDist < closestDist ? current : closest;
          }, results[0]);

          setCity(`${closestCity.name}, ${closestCity.country}`);
          handleCityCoords({
            ...closestCity,
            timezone: closestCity.timezone || "GMT",
          });
          setCities([]);
          setListHidden(true);
        } catch {
          setCity(getTranslation("localizationNot"));
          setCities([]);
          setListHidden(true);
        } finally {
          setListHidden(true);
        }
      },
      () => {
        setCity(getTranslation("localizationNot"));
        setCities([]);
        setListHidden(true);
      },
      { timeout: 10000 }
    );
  };

  const handleButtonClick = () => {
    if (city) {
      setCity("");
      setCities([]);
      setListHidden(true);
    } else {
      handleGetLocalization();
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-neutral-800">
      <div className="w-full md:w-2/3 flex flex-row gap-2 items-center rounded-md bg-neutral-100 border-2">
        <i className="fa-solid fa-magnifying-glass px-4 border-r-2"></i>
        <input
          type="text"
          value={city}
          spellCheck={false}
          onChange={(e) => setCity(e.target.value)}
          placeholder={getTranslation("enterCityName")}
          className="p-2 outline-0 w-full text-sm md:text-lg"
        />
        <button onClick={handleButtonClick}>
          <i
            className={`fa-solid ${
              city ? "fa-xmark" : "fa-location-dot"
            } px-4 border-l-2`}
          ></i>
        </button>
      </div>
      <ul
        className={`${
          listHidden && "hidden"
        } w-full md:w-2/3 max-h-50 overflow-y-auto list-none p-2 bg-neutral-100 rounded-md cursor-pointer border-1 flex flex-col text-sm md:text-lg`}
      >
        {cities.map((city, id) => (
          <button
            key={id}
            onClick={() => handleCitySelect(city)}
            className="p-2 border-b-2 w-full text-left cursor-pointer hover:bg-neutral-200"
          >
            {city.name}, {city.country}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Search;
