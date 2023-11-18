import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import AWS from "aws-sdk";
import { respond } from "../lib/discord.js";

const lambda = new AWS.Lambda();

export default async function handleHelloCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: `Hello, world!` },
  };
}
