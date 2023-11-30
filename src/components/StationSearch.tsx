import { useState, useEffect, type FormEvent } from "react";
import { stationSearch, type Place } from "../utils/entur/stationSearch";

export function StationSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Place[]>([]);

  async function fetchData(abortController: AbortController) {
    if (search === "") {
      setResults([]);
      return;
    }
    const places = await stationSearch(search, abortController);

    if (abortController.signal.aborted) return;
    setResults(places);
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    return () => {
      abortController.abort();
    };
  }, [search]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (results[0]) {
      window.location.href = `/station/${results[0].id}`;
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Station"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
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
