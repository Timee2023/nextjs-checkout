/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import Error from 'next/error';
import Spinner from './Spinner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);
ChartJS.defaults.color = '#212529';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.family =
    'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji';

const OrdersChart = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        getData();
    }, [router.isReady]);

    function getData() {
        // fetch
        fetch('/api/dashboard/orders', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setLoading(false);
                setData(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check if data found
    if (!data) {
        return <Spinner loading={loading} />;
    }

    // Return error if we don't have a product
    if (data && Object.keys(data).length === 0) {
        return <Error statusCode={404} />;
    }

    // Format the chart data
    const chartData = [];
    for (const row in data.results) {
        chartData.push({
            x: row,
            y: data.results[row],
        });
    }

    return (
        <Bar
            data={{
                labels: data.labels,
                datasets: [
                    {
                        label: 'Complete orders',
                        data: chartData,
                        borderWidth: 1,
                        borderColor: '#0d6efd',
                        backgroundColor: '#0d6efd',
                    },
                ],
            }}
            datasetIdKey="id"
            options={{
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    colors: {
                        enabled: false,
                    },
                },
                responsive: true,
            }}
        />
    );
};

export default OrdersChart;
