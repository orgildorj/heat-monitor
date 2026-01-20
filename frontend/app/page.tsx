"use client";

import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ClockIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import {
  formatDateTime,
  HeatingData,
  BackendCustomerData,
} from "@/util/mainTableUtil";
import { MainTable } from "./components/mainTable";
// import { MainTable } from "./components/mainTable";

const HeatingMonitorTable = () => {
  const [systemData, setSystemData] = useState<BackendCustomerData[]>([]);

  const [lastChecked, setLastChecked] = useState<string>();

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/heating/current");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Backend returned unsuccessful response");
      }

      console.log(result.data);
      setLastChecked(new Date().toLocaleString("de-DE"));

      setSystemData(result.data);
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
    <div className="min-h-screen p-4 md:p-6 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* System Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Heizungsüberwachung
            </h1>
            <p className="text-gray-600 mt-1">
              Echtzeit-Monitoring Ihrer Heizungsanlagen
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center">
                <ServerIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <div className="text-sm text-gray-500">Anlagen</div>
                  <div className="text-2xl font-bold">{systemData.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <div className="text-sm text-gray-500">
                  Letzte Aktualisierung
                </div>
                <div className="font-semibold">{lastChecked}</div>
              </div>
            </div>
          </div>

          <div className=" bg-blue-600 hover:bg-blue-700 rounded-xl shadow p-4">
            <button
              onClick={fetchData}
              className="w-full h-full flex items-center justify-center text-white rounded-lg transition-colors duration-200"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Aktualisieren
            </button>
          </div>
        </div>
      </div>
      <MainTable data={systemData} />
    </div>
  );
};

export default HeatingMonitorTable;
