import React from "react";
import style from "./HomePage.module.css";
import { NewsSection } from "src/components/sections/news-section/NewsSection";
import { ReportSection } from "src/components/sections/report-section/ReportSection";
import { MapSection } from "src/components/sections/map-section/MapSection";
import { TableSection } from "src/components/sections/table-section/TableSection";
import { ContactSection } from "src/components/sections/contact-section/ContactSection";

export const HomePage = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.leftColumn}>
        <ReportSection />
        <NewsSection />
      </div>
      <div className={style.middleColumn}>
        <MapSection />
      </div>
      <div className={style.rightColumn}>
        <TableSection />
        <ContactSection />
      </div>
    </div>
  );
};
