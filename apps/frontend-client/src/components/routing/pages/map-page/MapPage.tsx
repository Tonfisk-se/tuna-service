import React from "react";
import { getSightings, postSightings } from "src/utils/requests/methods";

export const MapPage = () => {
  return (
    <>
      <button onClick={() => getSightings()}>"Get Sightings"</button>
      <button onClick={() => postSightings()}>"Post Sightings"</button>
    </>
  );
};
