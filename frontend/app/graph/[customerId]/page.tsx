"use client";
import Link from "next/link";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for demonstration - replace with real data from your backend
const generateMockData = (customerName: string) => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            time: time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            fullTime: time.toLocaleString('de-DE'),
            t1: 45 + Math.random() * 10,
            t2: 50 + Math.random() * 8,
            t3: 55 + Math.random() * 7,
            t4: 48 + Math.random() * 9,
        });
    }

    return data;
};

interface CustomerGraphPageProps {
    customerName: string;
    onBack?: () => void;
}

export default function CustomerGraphPage({ customerName, onBack }: CustomerGraphPageProps) {
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
    const [selectedMetrics, setSelectedMetrics] = useState({
        t1: true,
        t2: true,
        t3: true,
        t4: true,
    });

    const data = generateMockData(customerName);

    const toggleMetric = (metric: keyof typeof selectedMetrics) => {
        setSelectedMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    const metrics = [
        { key: 't1', label: 'T1', color: '#ef4444' },
        { key: 't2', label: 'T2', color: '#f97316' },
        { key: 't3', label: 'T3', color: '#eab308' },
        { key: 't4', label: 'T4', color: '#22c55e' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/">
                        <button
                            onClick={onBack}
                            className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            ← Zurück zur Übersicht
                        </button>
                    </Link>

                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Time Range Selector */}
                        <div className="flex gap-2">
                            <span className="text-sm font-semibold text-gray-700 mr-2 flex items-center">Zeitraum:</span>
                            {(['24h', '7d', '30d'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {range === '24h' ? '24 Stunden' : range === '7d' ? '7 Tage' : '30 Tage'}
                                </button>
                            ))}
                        </div>

                        {/* Metric Toggles */}
                        <div className="flex gap-2">
                            <span className="text-sm font-semibold text-gray-700 mr-2 flex items-center">Anzeigen:</span>
                            {metrics.map(({ key, label, color }) => (
                                <button
                                    key={key}
                                    onClick={() => toggleMetric(key as keyof typeof selectedMetrics)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMetrics[key as keyof typeof selectedMetrics]
                                        ? 'text-white shadow-md'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    style={{
                                        backgroundColor: selectedMetrics[key as keyof typeof selectedMetrics] ? color : undefined,
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Temperaturverlauf</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                labelFormatter={(label: string) => `Zeit: ${label}`}
                                formatter={(value: number) => [`${value.toFixed(1)}°C`, '']}
                            />
                            <Legend />
                            {metrics.map(({ key, label, color }) => (
                                selectedMetrics[key as keyof typeof selectedMetrics] && (
                                    <Line
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={color}
                                        strokeWidth={2}
                                        name={label}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                )
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map(({ key, label, color }) => {
                        const values = data.map(d => d[key as keyof typeof d] as number);
                        const avg = values.reduce((a, b) => a + b, 0) / values.length;
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const current = values[values.length - 1];

                        return (
                            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-gray-700">{label}</h3>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">{current.toFixed(1)}°C</span>
                                        <span className="text-xs text-gray-500 ml-2">Aktuell</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-gray-500">Ø</div>
                                            <div className="font-semibold text-gray-700">{avg.toFixed(1)}°C</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Min</div>
                                            <div className="font-semibold text-gray-700">{min.toFixed(1)}°C</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Max</div>
                                            <div className="font-semibold text-gray-700">{max.toFixed(1)}°C</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}