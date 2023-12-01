import { graphql } from "./common";

export async function fetchJourney(id: string) {
  const res = await graphql(
    `
      query getJourney($id: String!) {
        serviceJourney(id: $id) {
          line {
            publicCode
          }
          estimatedCalls {
            aimedDepartureTime
            actualDepartureTime
            expectedDepartureTime
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
    { id },
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

  return {
    line: json.data.serviceJourney.line.publicCode,
    calls,
    destinations,
  };
}

export interface Call {
  aimedDepartureTime: Date;
  actualDepartureTime: Date;
  expectedDepartureTime: Date;
  station: string;
  stationId: string;
}
