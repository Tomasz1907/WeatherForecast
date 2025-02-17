import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

interface City {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

interface SearchProps {
    handleCityCoords: (city: City) => void;
}

const Search: React.FC<SearchProps> = ({ handleCityCoords }) => {
    const [city, setCity] = useState<string>('');
    const [cities, setCities] = useState<City[]>([]);
    const [debouncedCity, setDebouncedCity] = useState<string>('');
    const [listHidden, setListHidden] = useState<boolean>(true);

    useDebounce(() => setDebouncedCity(city), 500, [city]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${debouncedCity}`);
                const data = await response.json();
                if (data.results) {
                    setCities(data.results);
                    const cityName = debouncedCity.split(',')[0].trim();
                    setListHidden(cities.some(c => c.name === cityName));
                } else {
                    setCities([]);
                }
            } catch (error) {
                console.error('Error fetching city data:', error);
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
        handleCityCoords(selectedCity);
    };

    return (
        <div className="w-full flex flex-col items-center text-neutral-900">
            <div className="w-full md:w-2/3 flex flex-row gap-2 items-center rounded-md bg-neutral-100 text-neutral-900 border-2">
                <i className="fa-solid fa-magnifying-glass px-4 border-r-2"></i>
                <input
                    type="text"
                    value={city}
                    spellCheck={false}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="p-2 outline-0 w-full"
                />
            </div>
            <ul className={`${listHidden && 'hidden'} w-full md:w-2/3 max-h-50 overflow-y-auto list-none p-2 bg-neutral-100 rounded-md cursor-pointer border-1 flex flex-col`}>
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