import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import dotenv from 'dotenv';

// Load environment variables based on the current environment
const envFile = process.env.NODE_ENV === 'production' ? '../../.env.production' : '../../.env.development';
dotenv.config({ path: envFile });


interface Sighting {
  long: string;
  lat: string;
  comment?: string;
}

interface DbEntry {
  id: string;
  long: string;
  lat: string;
  comment?: string;
}

const app = express();
const port = 4200;
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/sightings", (req, res) => {
  res.send("Here are the sightings");
});

app.post("/sighting", (req: Request<object, object, Sighting>, res: Response) => {
  const { long, lat, comment } = req.body;
  const dbEntry: DbEntry = {
    long,
    lat,
    comment,
    id: uuidv4(),
  };
  console.log(dbEntry);
  res.send("I saw a tuna");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
