// export interface TemperatureData {
//   value: number;
//   unit: "°C";
//   timestamp: string;
//   status: "normal" | "warning" | "critical";
// }

// export interface SystemStatus {
//   status: "normal" | "warning" | "error";
//   message: string;
//   lastCheck: string;
// }

export interface HeatingData {
  CustomerId: string;
  ColName: string;
  Label: string;
  Value: number;
  Time: string;
}

export interface BackendResponse {
  success: boolean;
  data: BackendCustomerData[];
}

export interface BackendCustomerData {
  Customer: {
    user_id: string;
    device_id: string;
    long_name: string;
    additional_info?: string;
  };
  HeatingDatas: HeatingData[];
  LastUpdated: string;
}

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const time = new Date(dateString);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Gerade eben";
  if (diffMins < 60) return `Vor ${diffMins} Min`;
  if (diffHours < 24) return `Vor ${diffHours} Std`;
  return `Vor ${Math.floor(diffHours / 24)} Tagen`;
};
