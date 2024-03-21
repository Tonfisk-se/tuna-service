import React from "react";
import style from "./Header.module.css";
import { Title } from "../title";
import { NavigationButton } from "../navigation-button";
export const Header = () => {
  const ButtonList = [
    <NavigationButton label="Home" path="/home" />,
    <NavigationButton label="Map" path="/map" />,
    <NavigationButton label="Reports" path="/reports" />,
  ];
  return (
    <div className={style.header}>
      <div className={style.title}>
        <Title />
      </div>
      <div className={style.middleSection}></div>
      <div className={style.buttons}>{ButtonList}</div>
    </div>
  );
};
