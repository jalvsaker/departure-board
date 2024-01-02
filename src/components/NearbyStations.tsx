import { useEffect, useState } from "react";
import { nearbySearch } from "../utils/entur/nearbySearch";
import type { Place } from "../utils/entur/stationSearch";

export function NearbyStations() {
  const [nearbyStations, setNearbyStations] = useState<Place[]>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const stations = await nearbySearch(
        pos.coords.latitude,
        pos.coords.longitude,
      );
      setNearbyStations(stations);
    });
  }, []);

  if (!nearbyStations) {
    return <></>;
  }

  return (
    <div className="text-center pt-8">
      <h2 className="font-bold">Stations nearby:</h2>
      <ul>
        {nearbyStations.map((station) => (
          <li key={station.id}>
            <a href={`/station/${station.id}`}>{station.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
