"use client";
import { useState, useMemo, Fragment } from "react";
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  ExpandedState,
} from "@tanstack/react-table";
import { BackendResponseData, formatDateTime } from "@/util/mainTableUtil";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  data: BackendResponseData[];
}

export const MainTable = ({ data }: Props) => {
  const router = useRouter()
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.CustomerName.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns: ColumnDef<BackendResponseData>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
          className="text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
        >
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      ),
    },
    {
      accessorKey: "CustomerName",
      header: "Kunde",
    },
    {
      id: "t1",
      header: "T1",
      cell: ({ row }) => `${row.original.Parameters["puffer_t1"]?.Value ?? "N/A"} °C`,
    },
    {
      id: "t2",
      header: "T2",
      cell: ({ row }) => `${row.original.Parameters["puffer_t2"]?.Value ?? "N/A"} °C`,
    },
    {
      id: "t3",
      header: "T3",
      cell: ({ row }) => `${row.original.Parameters["puffer_t3"]?.Value ?? "N/A"} °C`,
    },
    {
      id: "t4",
      header: "T4",
      cell: ({ row }) => `${row.original.Parameters["puffer_t4"]?.Value ?? "N/A"} °C`,
    },
    {
      id: "status",
      header: "Status",
      cell: () => (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
          OK
        </span>
      ),
    },
    {
      id: "notification",
      header: "Benachrichtigung",
      cell: () => <span className="text-gray-400">—</span>,
    },
    {
      id: "lastUpTime",
      header: "Zuletzt online",
      cell: ({ row }) => `${formatDateTime(row.original.LastUpdated)}`
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
          <div className="relative">
            {/* Button that toggles the dropdown */}
            <button
              onClick={() => setOpen(!open)}
              className="px-2 py-1 text-lg font-bold rounded hover:bg-gray-200"
            >
              ⋮ {/* 3-dot menu */}
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  onClick={() => {
                    router.push(`/graph/${row.original.CustomerId}`)
                    console.log("Show Graph", row.original);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Show Graph
                </button>
                <button
                  onClick={() => {
                    console.log("New Evaluation", row.original);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  New Evaluation
                </button>
                <button
                  onClick={() => {
                    console.log("Delete Row", row.original);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      },
    }

  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row, index) => `row-${index}`,
  });

  return (
    <div className="h-full">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search Kunde..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header, i, arr) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left font-bold ${i === 0 ? "rounded-tl-2xl" : ""
                      } ${i === arr.length - 1 ? "rounded-tr-2xl" : ""}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={columns.length} className="bg-gray-50 px-8 py-4 border-t border-gray-200">

                      {/* Customer & Device Info */}
                      <div className="mb-3 text-sm text-gray-700 space-y-1">
                        <div>
                          <span className="font-semibold">Customer:</span> {row.original.CustomerName} (ID: {row.original.CustomerId})
                        </div>
                        <div>
                          <span className="font-semibold">Device ID:</span> {row.original.DeviceId}
                        </div>
                        <div>
                          <span className="font-semibold">Last Online:</span> {formatDateTime(row.original.LastUpdated)}
                        </div>
                        {/* {row.original.Cu && (
          <div>
            <span className="font-semibold">Additional Info:</span> {row.original.AdditionalInfo}
          </div>
        )} */}
                      </div>

                      {/* Parameter List */}
                      <ol className=" space-y-1 text-sm text-gray-700">
                        {Object.entries(row.original.Parameters || {}).map(([key, data]: [string, any]) => (
                          <li key={key}>
                            <span className="font-semibold">{data.Label}:</span>{" "}
                            <span>{data.Value}</span>
                          </li>
                        ))}
                      </ol>

                    </td>
                  </tr>
                )}





              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};