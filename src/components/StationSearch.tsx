import { useState, useEffect } from "react";
import { stationSearch, type place } from "../utils/entur";

export function StationSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<place[]>([]);

  async function fetchData(abortController: AbortController) {
    if (search === "") return;
    const places = await stationSearch(search, abortController);

    setResults(places);
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    return () => {
      abortController.abort();
    };
  }, [search]);

  return (
    <>
      <input
        placeholder="Station"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {results.map((place: any) => (
          <li key={place.id}>
            <a href={`/station/${place.id}`}>{place.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
