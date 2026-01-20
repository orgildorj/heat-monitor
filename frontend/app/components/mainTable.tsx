"use client";

import { useState, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation"; // Next.js 13+ router
import { BackendCustomerData } from "@/util/mainTableUtil";

interface Props {
  data: BackendCustomerData[];
}

export const MainTable = ({ data }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Filter data by Kunde (search box)
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.Customer.long_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Kunde",
      flex: 1,
    },
    { field: "t1", headerName: "T1", flex: 1 },
    { field: "t2", headerName: "T2", flex: 1 },
    { field: "t3", headerName: "T3", flex: 1 },
    { field: "t4", headerName: "T4", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            params.value === "OK"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "notification",
      headerName: "Benachrichtigung",
      flex: 2,
      renderCell: () => <span className="text-gray-400">—</span>,
    },
  ];

  const rows = filteredData.map((row, index) => ({
    id: index,
    name: row.Customer.long_name,
    t1: getValueByCol(row.HeatingDatas, "puffer_t1") + " °C",
    t2: getValueByCol(row.HeatingDatas, "puffer_t2") + " °C",
    t3: getValueByCol(row.HeatingDatas, "puffer_t3") + " °C",
    t4: getValueByCol(row.HeatingDatas, "puffer_t4") + " °C",
    status: getStatus(row.HeatingDatas),
    notification: "—",
    customerId: row.Customer.user_id, // for navigation
  }));

  return (
    <div className="h-full">
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search Kunde..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          onRowClick={(params) => {
            // Navigate to customer page
            router.push(`/customer/${params.row.customerId}`);
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              cursor: "pointer",
              fontSize: "16px",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "18px",
            },
          }}
        />
      </div>
    </div>
  );
};

// Helpers
const getValueByCol = (heatingDatas: any[], colName: string) => {
  const entry = heatingDatas.find((hd) => hd.ColName === colName);
  return entry ? entry.Value : "-";
};

const getStatus = (heatingDatas: any[]) => {
  const values = heatingDatas
    .filter((h) => h.ColName.startsWith("puffer_"))
    .map((h) => h.Value);
  return values.some((v) => v > 90) ? "WARNING" : "OK";
};
