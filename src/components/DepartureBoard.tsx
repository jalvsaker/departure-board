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
    if (!departure.realtime || departure.minutes > 15) {
      return departure.expectedDepartureTime.toLocaleString("no", {
        timeStyle: "short",
        timeZone: "Europe/Oslo",
      });
    }

    if (departure.minutes <= 0) {
      return "Now";
    }

    return `${departure.minutes} min`;
  }

  return (
    <>
      {modes.length > 1 && (
        <div className="text-center pb-2">
          {modes.map((mode) => (
            <span key={mode} className="px-2">
              <input
                type="checkbox"
                id={mode}
                checked={shownModes.includes(mode)}
                onChange={() => handleChange(mode)}
              />
              <label htmlFor={mode} className="capitalize pl-1">
                {mode}
              </label>
            </span>
          ))}
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-600">
            <th>Line</th>
            <th className="text-left">Destination</th>
            <th>Platform</th>
            <th>Departure</th>
          </tr>
        </thead>
        <tbody>
          {departures.map(
            (departure) =>
              shownModes.includes(departure.mode) && (
                <tr
                  key={departure.id + departure.aimedDepartureTime.getTime()}
                  className="even:bg-gray-100 dark:even:bg-gray-800"
                >
                  <td className="text-center">
                    <a href={`/service/${departure.date}/${departure.id}`}>
                      {departure.line}
                    </a>
                  </td>
                  <td>
                    <a href={`/service/${departure.date}/${departure.id}`}>
                      {departure.destination}
                    </a>
                  </td>
                  <td className="text-center">{departure.platform}</td>
                  <td className="text-center">
                    <a href={`/service/${departure.date}/${departure.id}`}>
                      {formatTime(departure)}
                    </a>
                  </td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </>
  );
}
