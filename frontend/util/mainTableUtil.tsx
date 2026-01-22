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

/*
type HeatingDataResponse struct {
  CustomerId   int
  DeviceId     int
  CustomerName string
  Parameters   map[string]*ParameterData
  LastUpdated  time.Time
}

type ParameterData struct {
  Label string  `json:"label"`
  Value float64 `json:"value"`
}
*/

interface ParameterData {
  Label: string,
  Value: number
}

export interface BackendResponseData {
  CustomerId: number;
  DeviceId: number;
  CustomerName: string;
  Parameters: { [key: string]: ParameterData },
  LastUpdated: string;
}

const months = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

export const formatDateTime = (dateString: string) => {
  const d = new Date(dateString);

  const formattedUTC =
    `${String(d.getUTCHours()).padStart(2, "0")}:` +
    `${String(d.getUTCMinutes()).padStart(2, "0")}:` +
    `${String(d.getUTCSeconds()).padStart(2, "0")}, ` +
    `${String(d.getUTCDate()).padStart(2, "0")}.` +
    `${String(d.getUTCMonth() + 1).padStart(2, "0")}.` +
    `${d.getUTCFullYear()}`;

  return formattedUTC
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
