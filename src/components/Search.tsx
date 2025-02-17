import React, { useState } from 'react'

const Search = () => {
    const [city, setCity] = useState('');

    const cities = [
        'City 1',
        'City 2',
        'City 3',
    ];

  return (
    <div className="w-full flex flex-col items-center text-neutral-900">
        <input
            type="text"
            placeholder="Enter city name"
            className='p-2 rounded-md bg-neutral-100 outline-0 w-full md:w-2/3 border-2'
        />
        <ul className=" hidden w-full md:w-2/3 list-none p-2 bg-neutral-100 rounded-md cursor-pointer border-1">
            {cities.map((city) => (
                <li className='p-2 border-b-2'>{city}</li>
            ))}
        </ul>
    </div>
  )
}

export default Search