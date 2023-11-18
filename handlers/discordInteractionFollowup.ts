import { APIInteraction, InteractionType } from "discord-api-types/v10";
import { dispatchAsyncCommand } from "../commands/dispatch.js";
import { DiscordInteractionParallelEvent } from "../lib/types.js";

export async function handleDiscordInteractionFollowup(
  event: DiscordInteractionParallelEvent
) {
  const strBody = event.eventPayload.body;
  if (!strBody) {
    throw new Error("no body");
  }
  const command = JSON.parse(strBody) as APIInteraction;

  if (command.type !== InteractionType.ApplicationCommand) {
    console.log("ignoring non-application command");
    return;
  }

  console.log("handleDiscordInteractionFollowup with command", command);

  await dispatchAsyncCommand(command);
  console.log("async command dispatched");
}
