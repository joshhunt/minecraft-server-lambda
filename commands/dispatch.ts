import { APIApplicationCommandInteraction } from "discord-api-types/v10";

import { commands } from "./registry.js";

export async function dispatchCommand(
  command: APIApplicationCommandInteraction
) {
  const commandObj = commands[command.data.name];

  if (commandObj) {
    return await commandObj.handler(command);
  }
}
