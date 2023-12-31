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
    const places = await stationSearch(search, 20, abortController);
    if (!places || abortController.signal.aborted) return;
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
      <form onSubmit={handleSubmit} method="POST" action="/api/search">
        <input
          placeholder="Station"
          className="text-center border-y w-full p-1 dark:bg-black dark:border-gray-800 outline-none"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      {results.length > 0 && (
        <ul className="absolute w-full bg-white dark:bg-gray-950 border-b dark:border-b-gray-900">
          {results.map((place) => (
            <li
              key={place.id}
              className="text-center first:font-semibold odd:bg-gray-100 dark:odd:bg-gray-900"
            >
              <a href={`/station/${place.id}`}>{place.name}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
