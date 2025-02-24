import React from "react";
import style from "./Title.module.css";
import { useNavigate } from "react-router-dom";

export const Title = () => {
  const navigate = useNavigate();

  function onClick() {
    navigate("/home");
  }
  return (
    <>
      <div className={style.title}>
        <div className={style.span}>
          <span onClick={onClick}>Tonfisk.nu 🐟</span>
        </div>
      </div>
    </>
  );
};
