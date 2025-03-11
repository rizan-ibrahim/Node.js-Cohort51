import express from "express";
import keys from "./sources/keys.js";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from backend to frontend!");
});

app.post("/weather", async (req, res) => {
  const cityName = req.body.cityName;

  if (!cityName) {
    return res.status(400).json({ message: "City name is required." });
  }
  const API_KEY = keys.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ message: "API key is missing." });
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.cod === "404") {
      return res.status(404).json({ weatherText: "city is not found!" });
    }

    const temperature = data.main.temp;
    res.status(200).json({
      weatherText: `The temperature in ${cityName} is ${temperature}°C`,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching weather data." });
  }
});

export default app;
