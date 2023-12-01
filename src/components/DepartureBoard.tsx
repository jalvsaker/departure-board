import { useState, useEffect } from "react";
import {
  fetchDepartures,
  type Departure,
} from "../utils/entur/fetchDepartures";

export function DepartureBoard({
  station,
  initialDepartures,
}: {
  station: string;
  initialDepartures: Departure[];
}) {
  const [departures, setDepartures] = useState<Departure[]>(initialDepartures);

  async function fetchData() {
    const res = await fetchDepartures(station);
    if (res) {
      setDepartures(res.departures);
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
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Destination</th>
            <th>Platform</th>
            <th>Departure</th>
          </tr>
        </thead>
        <tbody>
          {departures.map((departure) => (
            <tr key={departure.line + departure.destination}>
              <td>{departure.line}</td>
              <td>{departure.destination}</td>
              <td>{departure.platform}</td>
              <td>
                {departure.minutes === 0 ? "Now" : `${departure.minutes} min`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
