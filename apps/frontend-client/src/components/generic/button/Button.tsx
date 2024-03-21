import React from "react";
import style from "./button.module.css";

export interface ButtonProps {
  label: string;
  onClick: () => void;
}
export const Button = (props: ButtonProps) => {
  const { label, onClick } = props;
  return (
    <button className={style.button} onClick={onClick}>
      {label}
    </button>
  );
};
