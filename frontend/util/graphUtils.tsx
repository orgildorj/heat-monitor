export interface GraphDataPoint {
    time: string;
    values: Record<string, number>;
    labels: Record<string, string>;
}

export interface GraphDataResponse {
    customer_id: number;
    customer_name: string;
    time_range: string;
    start_time: string;
    end_time: string;
    data: GraphDataPoint[] | null;
}

export interface StatItem {
    col_name: string;
    label: string;
    avg: number;
    min: number;
    max: number;
    current: number;
}

export interface StatsResponse {
    customer_id: number;
    time_range: string;
    stats: StatItem[];
}

export interface AvailableColumn {
    col_name: string;
    label: string;
}

export const PRESET_RANGES = [
    {
        label: "Heute",
        getValue: () => {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Gestern",
        getValue: () => {
            const start = new Date();
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setHours(23, 59, 59, 999);

            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Letzte 3 Tage",
        getValue: () => {
            const start = new Date();
            start.setDate(start.getDate() - 3)
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Letzte 7 Tage",
        getValue: () => {
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const start = new Date(end);
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            return { startDate: start, endDate: end };
        },
    },
    {
        label: "Letzte 30 Tage",
        getValue: () => {
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const start = new Date(end);
            start.setDate(start.getDate() - 29);
            start.setHours(0, 0, 0, 0);

            return { startDate: start, endDate: end };
        },
    },

    // {
    //     label: "Letzter Monat",
    //     getValue: () => {
    //         const now = new Date();

    //         const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    //         start.setHours(0, 0, 0, 0);

    //         const end = new Date(now.getFullYear(), now.getMonth(), 0);
    //         end.setHours(23, 59, 59, 999);

    //         return { startDate: start, endDate: end };
    //     },
    // },
];

export const getInitialDateRange = (initialStartDate: string | null, initialEndDate: string | null) => {
    if (initialStartDate && initialEndDate) {
        return {
            startDate: new Date(initialStartDate),
            endDate: new Date(initialEndDate),
            key: "selection",
        };
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate());

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { startDate: start, endDate: end, key: "selection" };
};

