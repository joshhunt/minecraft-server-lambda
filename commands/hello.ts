import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import AWS from "aws-sdk";
import { respond, setFollowup } from "../lib/discord.js";

export async function helloInitialHandler(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  return respond("Hello, world! This is the initial response");
}

export async function helloAsyncHandler(
  command: APIApplicationCommandInteraction
) {
  await setFollowup(
    "Neat - this is the follow up message!",
    command.application_id,
    command.token
  );
}
