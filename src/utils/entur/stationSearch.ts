import { ET_CLIENT_NAME } from "./common";

export async function stationSearch(
  search: string,
  amount: number = 1,
  abortController?: AbortController,
) {
  try {
    const res = await fetch(
      `https://api.entur.io/geocoder/v1/autocomplete?text=${search}&size=${amount}&lang=no&boundary.country=NOR&layers=venue`,
      {
        signal: abortController?.signal,
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
  } catch {
    return undefined;
  }
}

export interface Place {
  id: string;
  name: string;
}
