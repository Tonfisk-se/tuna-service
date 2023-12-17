import { Card,Grid, Box, Typography } from "@mui/material";
import { IGMapsApiStatus } from "./types";
import { useScript } from "./utils/ExternalScriptProvider";
import Map from "./map/Map";
import { useState } from "react";

//import dotenv from 'dotenv';
//dotenv.config(); // Load environment variables from .env file

const SamplePage = () => {

    const key: string = ""; //TODO: GUBR string | undefined = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const GMapsApiStatus: IGMapsApiStatus = useScript(
        `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=Function.prototype`
    );

    const [mapDirections, setMapDirections] = useState<google.maps.DirectionsResult>();

    return(
        <>
            <Card sx={{paddingLeft: 5, paddingRight: 5, paddingTop: 5, marginTop: 5, backgroundColor: '#fff', paddingBottom: 5}}>
                <Typography>This is an example of Google maps integration with React hooks. Maps API, Places API, Distance Matrix API and Directions API demo.</Typography>
                { key === "" ? <Typography sx={{color: 'red'}}>No Google API key has been provided. Places, Distance Matrix, Directions and Places APIs cannot work without a valid API key!</Typography> : null}
                <Grid container spacing={0} sx={{flexDirection: { xs: "column", md: "row"}, marginTop: 5}}>
                    <Grid item md={6}>
                        <Map 
                            gMapsApiStatus={GMapsApiStatus.status === "ready"} 
                            mapDirections={mapDirections}
                        />
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

export default SamplePage;