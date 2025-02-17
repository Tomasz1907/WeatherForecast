const Header = () => {
  return (
    <div className="flex flex-col items-center gap-1">
        <div className="flex flex-row items-center gap-2">
            <i className="fa-solid fa-cloud"></i>
            <h1 className='text-2xl font-bold'>Weather App</h1>
        </div>
        <p className='text-sm'>Find out the weather in your city</p>
    </div>
  )
}

export default Header