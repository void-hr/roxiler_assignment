import React, { useState, useEffect } from 'react';
import "./stats.css"
import axios from 'axios';

const Stats = ({selectedMonth}) => {
    const [statisticsData, setStatisticsData] = useState(null);

    useEffect(() => {
        const fetchStatisticsData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/statistics?month=${selectedMonth}`);
                setStatisticsData(response.data);
            } catch (error) {
                console.error('Error fetching statistics data:', error);
            }
        };

        fetchStatisticsData();
    }, [selectedMonth]);

    const renderStatistics = () => {
        if (!statisticsData) {
            return <div>Loading...</div>;
        }

        return (
            <div className="stats_container">
                <h2>Statistics</h2>
                    <li>Total Sale Amount: $ {statisticsData?.totalSaleAmount.toFixed(2)}</li>
                    <li>Total Sold Items: {statisticsData?.totalSoldItems}</li>
                    <li>Total Not Sold Items: {statisticsData?.totalNotSoldItems}</li>
            </div>
        );
    };

    return (
        <div>
            {renderStatistics()}
        </div>
    );
};

export default Stats;
