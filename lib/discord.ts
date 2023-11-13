import {
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

export function interactionResponse(resp: APIInteractionResponse): any {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resp),
  };
}

export function respond(message: string): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: message },
  };
}

export async function setFollowup(
  message: string,
  discordAppID: string,
  interactionToken: string
): Promise<APIInteractionResponse> {
  const body = {
    content: message,
  };

  const url = `https://discord.com/api/v10/webhooks/${discordAppID}/${interactionToken}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await resp.json();
}
