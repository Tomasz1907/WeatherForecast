import React, { useEffect, useState} from 'react';
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
    const [city, setCity] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [debouncedCity, setDebouncedCity] = useState('');
    const [listHidden, setListHidden] = useState(true);
    useDebounce(() => setDebouncedCity(city), 500, [city]);

    useEffect(() => {
        if (debouncedCity) {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${debouncedCity}`)
                .then((res) => res.json())
                .then(data => {
                    if (data.results) {
                        setCities(data.results);
                        const cityName = debouncedCity.split(',')[0].trim();
                        setListHidden(cities.some(c => c.name === cityName));
                    } else {
                        setCities([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching city data:', error);
                    setCities([]);
                });
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
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className='p-2 rounded-md bg-neutral-100 outline-0 w-full md:w-2/3 border-2'
            />
            <ul className={`${listHidden && 'hidden'} w-full md:w-2/3 h-50  overflow-y-auto list-none p-2 bg-neutral-100 rounded-md cursor-pointer border-1 flex flex-col`}>
                {cities.map((city, id) => (
                    <button
                        key={id}
                        onClick={() => handleCitySelect(city)}
                        className='p-2 border-b-2 w-full text-left cursor-pointer hover:bg-neutral-200'
                    >
                        {city.name}, {city.country}
                    </button>
                ))}
            </ul>
        </div>
    );
};

export default Search;