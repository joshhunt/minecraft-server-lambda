import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types/v10";
import handleHelloCommand from "./hello.js";

interface Command {
  description: string;
  handler: (
    command: APIApplicationCommandInteraction
  ) => Promise<APIInteractionResponse> | APIInteractionResponse;
}

export const commands: Record<string, Command> = {
  hello: {
    description: "greets you",
    handler: handleHelloCommand,
  },
};
