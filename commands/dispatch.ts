import { APIApplicationCommandInteraction } from "discord-api-types/v10";

import { commands } from "./registry.js";

export async function dispatchCommand(
  command: APIApplicationCommandInteraction
) {
  const commandObj = commands[command.data.name];

  if (commandObj) {
    return await commandObj.initialHandler(command);
  }
}

export async function dispatchAsyncCommand(
  command: APIApplicationCommandInteraction
) {
  const commandObj = commands[command.data.name];

  if (commandObj) {
    return await commandObj.asyncHandler?.(command);
  }
}
