export const ET_CLIENT_NAME = "jalvsaker-departure-board";

export function graphql(query: string, variables?: any) {
  return fetch("https://api.entur.io/journey-planner/v3/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "ET-Client-Name": ET_CLIENT_NAME,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
}
