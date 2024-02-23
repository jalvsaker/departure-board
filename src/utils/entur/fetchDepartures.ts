import { graphql } from "./common";

export async function fetchDepartures(station: string) {
  const res = await graphql(
    `
      query ($station: String!) {
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
              publicCode
              line {
                publicCode
                transportMode
              }
            }
            quay {
              publicCode
              latitude
              longitude
            }
            realtime
            expectedDepartureTime
            aimedDepartureTime
            date
          }
        }
      }
    `,
    { station },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (!json.data?.stopPlace) {
    return undefined;
  }

  const now = Date.now();

  const departures: Departure[] = json.data.stopPlace.estimatedCalls.map(
    (departure: any): Departure => {
      const expectedDepartureTime = new Date(departure.expectedDepartureTime);
      const aimedDepartureTime = new Date(departure.aimedDepartureTime);

      const minutes = Math.floor(
        (expectedDepartureTime.getTime() - now) / (60 * 1000),
      );

      const line =
        departure.serviceJourney.line.publicCode ??
        departure.serviceJourney.publicCode;

      return {
        id: departure.serviceJourney.id,
        line,
        destination: departure.destinationDisplay.frontText,
        realtime: departure.realtime,
        expectedDepartureTime,
        aimedDepartureTime,
        minutes,
        platform: {
          code: departure.quay.publicCode,
          latitude: departure.quay.latitude,
          longitude: departure.quay.longitude,
        },
        mode: departure.serviceJourney.line.transportMode,
        date: departure.date,
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
  realtime: boolean;
  expectedDepartureTime: Date;
  aimedDepartureTime: Date;
  minutes: number;
  platform: {
    code: string;
    latitude: number;
    longitude: number;
  };
  mode: string;
  date: string;
}
