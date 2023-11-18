import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types/v10";
import { helloInitialHandler, helloAsyncHandler } from "./hello.js";
import {
  startServerInitialHandler,
  startServerAsyncHandler,
} from "./start-server.js";
import {
  stopServerInitialHandler,
  stopServerAsyncHandler,
} from "./stop-server.js";

interface Command {
  description: string;
  initialHandler: (
    command: APIApplicationCommandInteraction
  ) => Promise<APIInteractionResponse> | APIInteractionResponse;
  asyncHandler?: (command: APIApplicationCommandInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {
  hello: {
    description: "greets you",
    initialHandler: helloInitialHandler,
    asyncHandler: helloAsyncHandler,
  },

  ["start-server"]: {
    description: "starts up the server",
    initialHandler: startServerInitialHandler,
    asyncHandler: startServerAsyncHandler,
  },

  ["stop-server"]: {
    description: "stops the server",
    initialHandler: stopServerInitialHandler,
    asyncHandler: stopServerAsyncHandler,
  },
};
