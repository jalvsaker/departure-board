export async function fetchDepartures(station: string) {
  const res = await fetch("https://api.entur.io/journey-planner/v3/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "ET-Client-Name": "jalvsaker-departure-board",
    },
    body: JSON.stringify({
      query: `
      query getCalls($station: String!) {
        stopPlace(id: $station) {
            name
            estimatedCalls(
                numberOfDeparturesPerLineAndDestinationDisplay: 1
                numberOfDepartures: 30
                timeRange: 3600
            ) {
                destinationDisplay {
                    frontText
                }
                serviceJourney {
                    line {
                        publicCode
                    }
                }
                expectedDepartureTime
            }
        }
      }
      `,
      variables: { station },
    }),
  });

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (json.data.stopPlace === null) {
    return undefined;
  }

  const now = new Date();

  const departures: departure[] = json.data.stopPlace.estimatedCalls.map(
    (departure: any): departure => {
      const departureTime = new Date(departure.expectedDepartureTime);

      const minutes = Math.floor(
        (departureTime.getTime() - now.getTime()) / (60 * 1000),
      );

      return {
        line: departure.serviceJourney.line.publicCode,
        destination: departure.destinationDisplay.frontText,
        departureTime,
        minutes: minutes,
      };
    },
  );

  return {
    name: json.data.stopPlace.name,
    departures,
  };
}

export interface departure {
  line: string;
  destination: string;
  departureTime: Date;
  minutes: number;
}

export async function stationSearch(
  search: string,
  abortController: AbortController,
) {
  const res = await fetch(
    `https://api.entur.io/geocoder/v1/autocomplete?text=${search}&size=20&lang=no&boundary.country=NOR&layers=venue`,
    {
      signal: abortController.signal,
    },
  );

  const json = await res.json();
  const places: place[] = json.features.map((feature: any) => {
    return {
      id: feature.properties.id,
      name: feature.properties.label,
    };
  });

  return places;
}

export interface place {
  id: string;
  name: string;
}
