import { graphql } from "./common";

export async function fetchDepartures(station: string) {
  const res = await graphql(
    `
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
              publicCode
              line {
                publicCode
                transportMode
              }
            }
            quay {
              publicCode
            }
            realtime
            expectedDepartureTime
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

  if (json.data.stopPlace === null) {
    return undefined;
  }

  const now = Date.now();

  const departures: Departure[] = json.data.stopPlace.estimatedCalls.map(
    (departure: any): Departure => {
      const departureTime = new Date(departure.expectedDepartureTime);

      const minutes = Math.floor((departureTime.getTime() - now) / (60 * 1000));

      const line =
        departure.serviceJourney.line.publicCode ??
        departure.serviceJourney.publicCode;

      return {
        id: departure.serviceJourney.id,
        line,
        destination: departure.destinationDisplay.frontText,
        realtime: departure.realtime,
        departureTime,
        minutes,
        platform: departure.quay.publicCode,
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
  departureTime: Date;
  minutes: number;
  platform: string;
  mode: string;
  date: string;
}
