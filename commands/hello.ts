import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import { respond } from "../lib/discord.js";

export default async function handleHelloCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  return respond(`Hello, ${command.member?.user.username ?? "world"}!`);
}
