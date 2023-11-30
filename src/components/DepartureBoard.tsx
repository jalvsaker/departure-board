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
            {departure.minutes === 0 ? "Nå" : `${departure.minutes} min`}
          </li>
        ))}
      </ul>
    </>
  );
}
