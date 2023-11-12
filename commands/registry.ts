import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types/v10";
import handleHelloCommand from "./hello.js";
import handleStartServerCommand from "./start-server.js";
import handleStopServerCommand from "./stop-server.js";

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

  ["start-server"]: {
    description: "starts up the server",
    handler: handleStartServerCommand,
  },

  ["stop-server"]: {
    description: "stops the server",
    handler: handleStopServerCommand,
  },
};
