import { ET_CLIENT_NAME } from "./constants";

export async function stationSearch(
  search: string,
  abortController: AbortController,
) {
  const res = await fetch(
    `https://api.entur.io/geocoder/v1/autocomplete?text=${search}&size=20&lang=no&boundary.country=NOR&layers=venue`,
    {
      signal: abortController.signal,
      headers: { "ET-Client-Name": ET_CLIENT_NAME },
    },
  );

  const json = await res.json();
  const places: Place[] = json.features.map((feature: any) => {
    return {
      id: feature.properties.id,
      name: feature.properties.label,
    };
  });

  return places;
}

export interface Place {
  id: string;
  name: string;
}
