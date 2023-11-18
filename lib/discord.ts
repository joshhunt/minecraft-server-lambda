import {
  APIInteractionResponse,
  APIMessage,
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
  interactionToken: string,
  messageIDToEdit?: string
): Promise<APIMessage> {
  console.log("Sending followup message", message);

  const body = {
    content: message,
  };

  const url = messageIDToEdit
    ? `https://discord.com/api/v10/webhooks/${discordAppID}/${interactionToken}/messages/${messageIDToEdit}`
    : `https://discord.com/api/v10/webhooks/${discordAppID}/${interactionToken}`;

  const resp = await fetch(url, {
    method: messageIDToEdit ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await resp.json();
}
