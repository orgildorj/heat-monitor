"use client";

import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ClockIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import {
  BackendResponseData,
} from "@/util/mainTableUtil";
import { MainTable } from "./components/mainTable";
import { BACKEND_API } from "@/util/urlUtils";
import { Navbar } from "./components/navbar";

const HeatingMonitorTable = () => {
  const [systemData, setSystemData] = useState<BackendResponseData[]>([]);

  const [lastChecked, setLastChecked] = useState<string>();

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_API}/api/heating/current`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log(result);
      setLastChecked(new Date().toLocaleString("de-DE"));

      setSystemData(result);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      // Optional: set error state for UI feedback
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Lade Heizungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4 md:p-6 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* System Header */}
        <div className="w-fit mb-6 flex flex-col lg:flex-row lg:items-stretch justify-between gap-4">

          {/* Anlagen Card */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex items-center gap-3">
            <ServerIcon className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-500">Anlagen</div>
              <div className="text-2xl font-bold">{systemData.length}</div>
            </div>
          </div>

          {/* Letzte Aktualisierung Card */}
          <div className="bg-white rounded-xl shadow p-4 flex-2 flex items-center gap-3">
            <ClockIcon className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-500">Letzte Aktualisierung</div>
              <div className="font-semibold">{lastChecked}</div>
            </div>
          </div>

          {/* Aktualisieren Button */}
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow flex-1 flex items-center justify-center text-white font-semibold transition-colors duration-200 p-4"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Aktualisieren
          </button>

        </div>


        <MainTable data={systemData} />
      </div>
    </>
  );
};

export default HeatingMonitorTable;
