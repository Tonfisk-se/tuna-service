import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, MapPage, ReportPage } from "./pages";
import { Header } from "../header";
export const MainRouting = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path={"/home"} Component={HomePage} />
        <Route path={"/map"} Component={MapPage} />
        <Route path={"/reports"} Component={ReportPage} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};
