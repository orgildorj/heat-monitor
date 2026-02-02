"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BACKEND_API } from "@/util/urlUtils";
import Link from "next/link";
import Select from "react-select";
import { GraphDataResponse, PRESET_RANGES, StatsResponse, AvailableColumn, getInitialDateRange } from "@/util/graphUtils"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const CustomerGraphPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const customerId = searchParams.get("customer_id");
    const initialStartDate = searchParams.get("start_date");
    const initialEndDate = searchParams.get("end_date");

    const [dateRange, setDateRange] = useState(getInitialDateRange(initialStartDate, initialEndDate));
    const [availableColumns, setAvailableColumns] = useState<AvailableColumn[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [graphData, setGraphData] = useState<GraphDataResponse | null>(null);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch available columns
    useEffect(() => {
        if (customerId) {
            fetchAvailableColumns();
        }
    }, [customerId]);

    const fetchAvailableColumns = async () => {
        if (!customerId) return;

        try {
            const res = await fetch(
                `${BACKEND_API}/api/available-columns?customer_id=${customerId}`
            );
            if (!res.ok) throw new Error("Failed to fetch columns");

            const data = await res.json();
            const cols: AvailableColumn[] = data.columns || [];
            setAvailableColumns(cols);

            // Initial selection
            const initialCols = ["puffer_t1", "puffer_t2", "puffer_t3", "puffer_t4"];
            setSelectedColumns(initialCols);
        } catch (err) {
            console.error("Failed to fetch columns:", err);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        if (customerId && selectedColumns.length > 0 && dateRange) {
            fetchData();
        }
    }, [customerId, selectedColumns, dateRange]);

    // Sync URL when date range changes
    useEffect(() => {
        if (customerId && dateRange) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("start_date", dateRange.startDate.toISOString());
            params.set("end_date", dateRange.endDate.toISOString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [dateRange]);

    const fetchData = async () => {
        if (!customerId || selectedColumns.length === 0 || !dateRange) return;

        setLoading(true);
        setError(null);

        try {
            const start = new Date(dateRange.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(dateRange.endDate);
            end.setHours(23, 59, 59, 999);

            const params = new URLSearchParams();
            params.set("customer_id", customerId);
            params.set("col_names", selectedColumns.join(","));
            params.set("start_date", start.toISOString());
            params.set("end_date", end.toISOString());

            const [graphRes, statsRes] = await Promise.all([
                fetch(`${BACKEND_API}/api/graph-data?${params.toString()}`),
                fetch(`${BACKEND_API}/api/graph-data/stats?${params.toString()}`),
            ]);

            if (!graphRes.ok || !statsRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const graphData: GraphDataResponse = await graphRes.json();
            const statsData: StatsResponse = await statsRes.json();

            console.log(graphData)

            setGraphData(graphData);
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Prepare Recharts data
    const chartData = useMemo(() => {
        if (!graphData?.data || selectedColumns.length === 0) return [];

        const sorted = [...graphData.data].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        return sorted.map((point) => {
            const date = new Date(point.time);
            const formatted = `${date.getUTCDate()}. ${date.toLocaleString('de-DE', {
                month: 'short',
                timeZone: 'UTC'
            })} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;

            return {
                time: formatted,
                timestamp: date.getTime(),
                ...selectedColumns.reduce((acc, colName) => ({
                    ...acc,
                    [colName]: point.values?.[colName] ?? null
                }), {})
            };
        });
    }, [graphData, selectedColumns]);

    // Color palette for lines
    const colors = [
        "#3b82f6", // blue
        "#ef4444", // red
        "#10b981", // green
        "#f59e0b", // amber
        "#8b5cf6", // violet
        "#ec4899", // pink
        "#06b6d4", // cyan
        "#f97316", // orange
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Format the timestamp
            const date = new Date(label);
            const formattedTime = `${date.getUTCDate()}. ${date.toLocaleString('de-DE', {
                month: 'short',
                timeZone: 'UTC'
            })} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{formattedTime}</p>
                    {payload.map((entry: any, index: number) => {
                        const col = availableColumns.find(c => c.col_name === entry.dataKey);
                        return (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {col?.label || entry.dataKey}: <span className="font-semibold">{entry.value?.toFixed(1)}°C</span>
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    if (!customerId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Kein Kunde ausgewählt</p>
                    <Link href="/">
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Zurück zur Übersicht
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && selectedColumns.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">


                {/* Main Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="p-6  mx-auto">

                        <Link href="/">
                            <button
                                className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                ← Zurück zur Übersicht
                            </button>
                        </Link>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {graphData?.customer_name || "Kunde"}
                            </h1>
                            <p className="text-gray-600">
                                {dateRange.startDate.toLocaleDateString("de-DE")} - {dateRange.endDate.toLocaleDateString("de-DE")}
                            </p>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-600 text-sm">{error}</p>
                                <button
                                    onClick={fetchData}
                                    className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                                >
                                    Erneut versuchen
                                </button>
                            </div>
                        )}

                        {/* Chart */}
                        {selectedColumns.length > 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                                {loading ? (
                                    <div className="h-[500px] flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={500}>
                                        <LineChart
                                            data={chartData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="timestamp"
                                                type="number"
                                                domain={[
                                                    new Date(dateRange.startDate).setHours(0, 0, 0, 0),
                                                    new Date(dateRange.endDate).setHours(23, 59, 59, 999)
                                                ]}
                                                scale="time"
                                                tickFormatter={(timestamp) => {
                                                    const date = new Date(timestamp);
                                                    return `${date.getUTCDate()}. ${date.toLocaleString('de-DE', {
                                                        month: 'short',
                                                        timeZone: 'UTC'
                                                    })} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
                                                }}
                                                tick={{ fontSize: 12 }}
                                                stroke="#6b7280"
                                            />
                                            <YAxis
                                                label={{ value: 'Temperatur (°C)', angle: -90, position: 'insideLeft' }}
                                                tick={{ fontSize: 12 }}
                                                stroke="#6b7280"
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                formatter={(value) => {
                                                    const col = availableColumns.find(c => c.col_name === value);
                                                    return col?.label || value;
                                                }}
                                            />
                                            {selectedColumns.map((colName, index) => (
                                                <Line
                                                    key={colName}
                                                    type="linear"
                                                    dataKey={colName}
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth={2}
                                                    connectNulls={true}
                                                    dot={false}
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[500px] flex items-center justify-center text-gray-500">
                                        Keine Daten verfügbar
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mb-6">
                                <div className="max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Keine Parameter ausgewählt
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Wählen Sie Parameter aus der Seitenleiste, um Daten anzuzeigen.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Statistics Cards */}
                        {stats && stats.stats.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {stats.stats.map((stat) => (
                                    <div
                                        key={stat.col_name}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div><h3 className="text-sm font-bold text-gray-700 mb-3">
                                            {stat.label}
                                        </h3></div>

                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {stat.current.toFixed(1)}°C
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    Aktuell
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-100">
                                                <div>
                                                    <div className="text-gray-500">Ø</div>
                                                    <div className="font-semibold text-gray-700">
                                                        {stat.avg.toFixed(1)}°C
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Min</div>
                                                    <div className="font-semibold text-gray-700">
                                                        {stat.min.toFixed(1)}°C
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Max</div>
                                                    <div className="font-semibold text-gray-700">
                                                        {stat.max.toFixed(1)}°C
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Filters */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto pt-6">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Filter</h2>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Zeitraum
                            </label>

                            <div className="flex flex-col gap-4">
                                {/* Start Date */}
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Startdatum</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate.toISOString().substring(0, 10)}
                                        onChange={(e) =>
                                            setDateRange({
                                                ...dateRange,
                                                startDate: new Date(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-600 mb-1">Enddatum</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate.toISOString().substring(0, 10)}
                                        onChange={(e) =>
                                            setDateRange({
                                                ...dateRange,
                                                endDate: new Date(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Column Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Parameter ({selectedColumns.length})
                            </label>
                            <Select
                                isMulti
                                options={availableColumns.map((col) => ({
                                    value: col.col_name,
                                    label: col.label
                                }))}
                                value={availableColumns
                                    .filter(col => selectedColumns.includes(col.col_name))
                                    .map(col => ({ value: col.col_name, label: col.label }))}
                                onChange={(selectedOptions) => {
                                    setSelectedColumns(selectedOptions.map(opt => opt.value));
                                }}
                                placeholder="Wähle Parameter..."
                                className="text-sm"
                                classNamePrefix="select"
                                closeMenuOnSelect={false}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => setSelectedColumns(availableColumns.map(c => c.col_name))}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    Alle
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={() => setSelectedColumns([])}
                                    className="text-xs text-gray-600 hover:text-gray-700"
                                >
                                    Keine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerGraphPage;