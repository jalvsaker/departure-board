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
        line: departure.serviceJourney.line.publicCode,
        destination: departure.destinationDisplay.frontText,
        departureTime,
        minutes: minutes,
        platform: departure.quay.publicCode,
      };
    },
  );

  return {
    name: json.data.stopPlace.name,
    departures,
  };
}

export interface Departure {
  line: string;
  destination: string;
  departureTime: Date;
  minutes: number;
  platform: string;
}
