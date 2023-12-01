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
  const modes = [...new Set(departures.map((d) => d.mode))].sort();
  const [shownModes, setShownModes] = useState(modes);

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

  function handleChange(mode: string) {
    if (shownModes.includes(mode)) {
      setShownModes((shownModes) => shownModes.filter((m) => m !== mode));
    } else {
      setShownModes((shownModes) => [...shownModes, mode]);
    }
  }

  function formatTime(departure: Departure): string {
    if (departure.minutes === 0) {
      return "Now";
    } else if (departure.minutes >= 1 && departure.minutes <= 15) {
      return `${departure.minutes} min`;
    } else {
      return departure.departureTime.toLocaleString("no", {
        timeStyle: "short",
      });
    }
  }

  return (
    <>
      {modes.length > 1 &&
        modes.map((mode) => (
          <span key={mode}>
            <input
              type="checkbox"
              id={mode}
              checked={shownModes.includes(mode)}
              onChange={() => handleChange(mode)}
            />
            <label htmlFor={mode}>{mode}</label>
          </span>
        ))}
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
          {departures.map(
            (departure) =>
              shownModes.includes(departure.mode) && (
                <tr key={departure.id + departure.departureTime}>
                  <td>{departure.line}</td>
                  <td>{departure.destination}</td>
                  <td>{departure.platform}</td>
                  <td>{formatTime(departure)}</td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </>
  );
}
