import { useEffect, useState } from "react";
import { fetchJourney, type Call } from "../utils/entur/fetchJourney";

export function ServiceBoard({
  serviceId,
  initialCalls,
  date,
}: {
  serviceId: string;
  initialCalls: Call[];
  date: string;
}) {
  function formatTime(date: Date) {
    return date.toLocaleString("no", {
      timeStyle: "short",
      timeZone: "Europe/Oslo",
    });
  }

  const [calls, setCalls] = useState(initialCalls);

  async function fetchData() {
    const res = await fetchJourney(serviceId, date);
    if (res) {
      setCalls(res.calls);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-600">
            <th className="text-left pl-2">Stop</th>
            <th>Aimed</th>
            <th>Expected</th>
            <th>Actual</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr
              key={call.station + call.aimedDepartureTime.getTime()}
              className="even:bg-gray-100 dark:even:bg-gray-800"
            >
              <td className="pl-2">
                <a href={`/station/${call.stationId}`}>{call.station}</a>
              </td>
              <td className="text-center">
                {formatTime(call.aimedDepartureTime)}
              </td>
              <td className="text-center">
                {formatTime(call.expectedDepartureTime)}
              </td>
              <td className="text-center">
                {call.actualDepartureTime.getTime() !== 0 &&
                  formatTime(call.actualDepartureTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
