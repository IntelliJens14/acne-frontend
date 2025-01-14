import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherChart from "./WeatherChart";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Import Material-UI icon
import OpacityIcon from "@mui/icons-material/Opacity"; // Icon for Humidity
import InvertColorsIcon from "@mui/icons-material/InvertColors"; // Icon for Rain
import AirIcon from "@mui/icons-material/Air"; // Icon for Wind Speed
import BarometerIcon from "@mui/icons-material/Barometer"; // Custom icon if needed
import "./styles.css";

const WeatherDisplay = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://weather-monitoring-xqgs.onrender.com"); // Update URL for production
        const newData = response.data;

        setData(newData);
        setHistory((prev) => [
          ...prev.slice(-29), // Keep the last 30 entries
          { time: new Date().toLocaleTimeString(), ...newData },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 1000);
    fetchData();

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="weather-container">
      <h1>Weather Monitoring</h1>
      
      {/* Temperature */}
      <div className="data-row">
        <WbSunnyIcon style={{ marginRight: "10px", color: "#FFA500" }} />
        <strong>Temperature:</strong> {data.temperature || "N/A"} °C
      </div>

      {/* Humidity */}
      <div className="data-row">
        <OpacityIcon style={{ marginRight: "10px", color: "#007BFF" }} />
        <strong>Humidity:</strong> {data.humidity || "N/A"} %
      </div>

      {/* Rain */}
      <div className="data-row">
        <InvertColorsIcon style={{ marginRight: "10px", color: "#00C853" }} />
        <strong>Rain:</strong> {data.rain || "N/A"}
      </div>

      {/* Wind Speed */}
      <div className="data-row">
        <AirIcon style={{ marginRight: "10px", color: "#673AB7" }} />
        <strong>Wind Speed:</strong> {data.windSpeed || "N/A"} m/s
      </div>

      {/* Pressure */}
      <div className="data-row">
        <BarometerIcon style={{ marginRight: "10px", color: "#FF5722" }} />
        <strong>Pressure:</strong> {data.pressure || "N/A"} hPa
      </div>

      {/* Weather Chart */}
      <WeatherChart data={history} />
    </div>
  );
};

export default WeatherDisplay;
