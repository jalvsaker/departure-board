import { ET_CLIENT_NAME } from "./constants";

export async function fetchDepartures(station: string) {
  const res = await fetch("https://api.entur.io/journey-planner/v3/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "ET-Client-Name": ET_CLIENT_NAME,
    },
    body: JSON.stringify({
      query: `
        query getCalls($station: String!) {
            stopPlace(id: $station) {
                name
                estimatedCalls(
                    numberOfDeparturesPerLineAndDestinationDisplay: 2
                    numberOfDepartures: 50
                    timeRange: 3600
                ) {
                    destinationDisplay {
                        frontText
                    }
                    serviceJourney {
                        id
                        line {
                            publicCode
                            transportMode
                        }
                    }
                    quay {
                        publicCode
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

  const departures: Departure[] = json.data.stopPlace.estimatedCalls.map(
    (departure: any): Departure => {
      const departureTime = new Date(departure.expectedDepartureTime);

      const minutes = Math.floor(
        (departureTime.getTime() - now.getTime()) / (60 * 1000),
      );

      return {
        id: departure.serviceJourney.id,
        line: departure.serviceJourney.line.publicCode,
        destination: departure.destinationDisplay.frontText,
        departureTime,
        minutes: minutes,
        platform: departure.quay.publicCode,
        mode: departure.serviceJourney.line.transportMode,
      };
    },
  );

  return {
    name: json.data.stopPlace.name,
    departures,
  };
}

export interface Departure {
  id: string;
  line: string;
  destination: string;
  departureTime: Date;
  minutes: number;
  platform: string;
  mode: string;
}
