import { getTranslation } from "../utils/translation";
const Header = () => {
  return (
    <div className="flex flex-col items-center gap-1 pt-10">
      <div className="flex flex-row items-center gap-2">
        <i className="fa-solid fa-cloud"></i>
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
      </div>
      <p className="text-sm">{getTranslation("headerText")}</p>
    </div>
  );
};

export default Header;
