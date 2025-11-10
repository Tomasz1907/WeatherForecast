const Footer = () => {
  return (
    <footer className="w-full h-full py-6 flex flex-col md:flex-row gap-5 items-center justify-center text-base lg:text-lg  bg-blue-900 text-white drop-shadow-md">
      <p>2025</p>
      <p className="hidden md:block">•</p>
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-center gap-1 font-bold">
          <i className="fa-solid fa-cloud fa-sm mb-1"></i>
          <p>WeatherForecast</p>
        </div>
        <p>by Tomasz 1907</p>
      </div>
      <p className="hidden md:block">•</p>
      <p>All rights reserved.</p>
    </footer>
  );
};

export default Footer;
