import { ET_CLIENT_NAME } from "./common";
import type { Place } from "./stationSearch";

export async function nearbySearch(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.entur.io/geocoder/v1/reverse?point.lat=${latitude}&point.lon=${longitude}&size=10&layers=venue&boundary.country=NOR`,
    {
      headers: { "ET-Client-Name": ET_CLIENT_NAME },
    },
  );

  const json = await res.json();

  const places: Place[] = json.features.map((feature: any) => {
    return {
      id: feature.properties.id,
      name: feature.properties.name,
    };
  });

  return places;
}
