import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { StatusCodes } from "http-status-codes";
import { DiscordInteractionFollowupEvent } from "./types.js";

export function responseMessage(
  message: string,
  statusCode: number = StatusCodes.OK
) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
}

export function createDiscordInteractionFollowupEvent(
  interaction: APIApplicationCommandInteraction
): DiscordInteractionFollowupEvent {
  return {
    type: "discord-interaction-followup",
    interaction,
  };
}
