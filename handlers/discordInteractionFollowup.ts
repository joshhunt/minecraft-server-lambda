import { dispatchAsyncCommand } from "../commands/dispatch.js";
import { DiscordInteractionFollowupEvent } from "../lib/types.js";

export async function handleDiscordInteractionFollowup(
  event: DiscordInteractionFollowupEvent
) {
  const command = event.interaction;
  console.log("handleDiscordInteractionFollowup with command", command);

  await dispatchAsyncCommand(command);
  console.log("async command dispatched");
}
