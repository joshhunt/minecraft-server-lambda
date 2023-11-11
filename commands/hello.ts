import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

export default function handleHelloCommand(
  command: APIApplicationCommandInteraction
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: "Hello, world!" },
  };
}
