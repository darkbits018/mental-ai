import React, { useState, useEffect } from 'react';
import { getStressHistoryAPI } from './api';
import { StressRecord } from './types';

export function StressHistoryPage() {
    const [history, setHistory] = useState<StressRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const data = await getStressHistoryAPI();
                setHistory(data);
            } catch (err) {
                console.error("Failed to fetch stress history:", err);
                setError("Failed to load stress history. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return <div className="flex-1 p-6 text-center text-gray-500">Loading stress history...</div>;
    }

    if (error) {
        return <div className="flex-1 p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Stress History</h1>
            {history.length === 0 ? <p className="text-gray-600">No stress records found.</p> : (
                <ul className="space-y-4">
                    {history.map((record) => (
                        <li key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-lg font-semibold text-gray-800">Stress Level: {record.stress_level}/10</p>
                            <p className="text-gray-700 mt-1">Insights: {record.insights}</p>
                            <p className="text-gray-500 text-sm mt-1">Recorded on: {new Date(record.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}