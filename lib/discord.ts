import { APIInteractionResponse } from "discord-api-types/v10";

export function interactionResponse(resp: APIInteractionResponse): any {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resp),
  };
}
