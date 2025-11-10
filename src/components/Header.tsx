import { getTranslation } from "../utils/translation";
const Header = () => {
  return (
    <div className="flex flex-col items-center gap-1 pt-10">
      <div className="flex flex-row items-center gap-2 mb-5">
        <i className="fa-solid fa-cloud fa-lg md:fa-2xl "></i>
        <h1
          style={{ fontFamily: "Pacifico, cursive" }}
          className="text-2xl md:text-4xl "
        >
          Weather Forecast
        </h1>
      </div>
      <p className="text-base md:text-xl">{getTranslation("headerText")}</p>
    </div>
  );
};

export default Header;
