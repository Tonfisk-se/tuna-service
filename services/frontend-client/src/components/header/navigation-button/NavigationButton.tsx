import React from "react";
import { Button } from "src/components/generic";
import { useNavigate } from "react-router-dom";

export interface NavigationButtonProps {
  label: string;
  path: string;
}

export const NavigationButton = (props: NavigationButtonProps) => {
  const { label, path } = props;
  console.log(path);
  const navigate = useNavigate();
  const onClick = () => {
    navigate(path);
  };
  return <Button label={label} onClick={onClick} />;
};
