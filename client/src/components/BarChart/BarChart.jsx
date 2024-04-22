import React, { useEffect, useState } from "react";
import axios from "axios";
import "./barchart.css"
import { Bar } from "react-chartjs-2";
import {
    Chart as Chartjs,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    BarElement,
    PointElement,
} from "chart.js";


Chartjs.register(
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    PointElement,
    BarElement
);
const Barchart = ({ selectedMonth }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/bar-chart?month=${selectedMonth}`);
                setBarChartData(response.data);
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
            }
        };

        fetchData();
    }, [selectedMonth])
    const labels = barChartData.map((data) => data.priceRange);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Items count within price range",
            },
            tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
        },
    };
    const data = {
        labels,
        datasets: [
            {
                label: "Items",
                data: barChartData.map((data) => data.itemsCount),
                borderWidth: 1,
                backgroundColor: [
                    "#001524",
                    "#15616d",
                    "#ffecd1",
                    "#ff7d00",
                    "#78290f",
                    "#bb9457",
                    "#ca6702",
                ],
            },
        ],
    };

    return (
        <div className="bar_container">
            <Bar options={options} data={data} />
        </div>)
};

export default Barchart;
