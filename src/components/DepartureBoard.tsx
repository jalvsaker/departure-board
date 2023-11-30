import { useState, useEffect } from "react";
import { fetchDepartures, type departure } from "../utils/entur";

export function DepartureBoard({
  station,
  stationName,
  initialDepartures,
}: {
  station: string;
  stationName: string;
  initialDepartures: departure[];
}) {
  const [departures, setDepartures] = useState<departure[]>(initialDepartures);

  async function fetchData() {
    const res = await fetchDepartures(station);
    if (res) {
      setDepartures(res.departures);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ul>
        {departures.map((departure) => (
          <li key={departure.line + departure.destination}>
            {departure.line} {departure.destination}
            {" - "}
            {departure.minutes !== 0 ? `${departure.minutes} min` : "Nå"}
          </li>
        ))}
      </ul>
    </>
  );
}
