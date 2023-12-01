import { useState, useEffect } from "react";
import {
  fetchDepartures,
  type Departure,
} from "../utils/entur/fetchDepartures";

export function DepartureBoard({
  station,
  initialDepartures,
  modes,
}: {
  station: string;
  initialDepartures: Departure[];
  modes: string[];
}) {
  const [departures, setDepartures] = useState<Departure[]>(initialDepartures);
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
                <tr key={departure.line + departure.destination}>
                  <td>{departure.line}</td>
                  <td>{departure.destination}</td>
                  <td>{departure.platform}</td>
                  <td>
                    {departure.minutes === 0
                      ? "Now"
                      : `${departure.minutes} min`}
                  </td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </>
  );
}
