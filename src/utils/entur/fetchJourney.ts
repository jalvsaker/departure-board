import { graphql } from "./common";

export async function fetchJourney(id: string, date: string) {
  const res = await graphql(
    `
      query ($id: String!, $date: Date!) {
        serviceJourney(id: $id) {
          line {
            publicCode
          }
          publicCode
          estimatedCalls(date: $date) {
            aimedDepartureTime
            actualDepartureTime
            expectedDepartureTime
            cancellation
            quay {
              name
              stopPlace {
                id
                parent {
                  id
                }
              }
            }
            destinationDisplay {
              frontText
            }
          }
        }
      }
    `,
    { id, date },
  );

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();

  if (json.data.serviceJourney === null) {
    return undefined;
  }

  const calls: Call[] = json.data.serviceJourney.estimatedCalls.map(
    (call: any): Call => {
      return {
        aimedDepartureTime: new Date(call.aimedDepartureTime),
        actualDepartureTime: new Date(call.actualDepartureTime),
        expectedDepartureTime: new Date(call.expectedDepartureTime),
        cancellation: call.cancellation,
        station: call.quay.name,
        stationId: call.quay.stopPlace.parent?.id ?? call.quay.stopPlace.id,
      };
    },
  );

  const destinations = [
    ...new Set(
      json.data.serviceJourney.estimatedCalls.map(
        (call: any) => call.destinationDisplay.frontText,
      ),
    ),
  ];

  const line =
    json.data.serviceJourney.line.publicCode ??
    json.data.serviceJourney.publicCode;

  return {
    line,
    calls,
    destinations,
  };
}

export interface Call {
  aimedDepartureTime: Date;
  actualDepartureTime: Date;
  expectedDepartureTime: Date;
  cancellation: boolean;
  station: string;
  stationId: string;
}
