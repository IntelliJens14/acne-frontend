import React from "react";
import { Line } from "react-chartjs-2";

const WeatherChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.time), // x-axis labels (e.g., timestamps)
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((entry) => entry.temperature),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4, // smooth curves
      },
      {
        label: "Humidity (%)",
        data: data.map((entry) => entry.humidity),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
          color: "#333",
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", margin: "20px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeatherChart;
