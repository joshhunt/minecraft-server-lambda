import { Handler, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleAPIGatewayEvent } from "./handlers/apiGateway.js";
import { DiscordInteractionParallelEvent } from "./lib/types.js";
import { handleDiscordInteractionFollowup } from "./handlers/discordInteractionFollowup.js";

type Event = DiscordInteractionParallelEvent | APIGatewayEvent;

export const handler: Handler<Event> = async (event, context) => {
  console.log("Lambda recieved event", event);
  console.log("with context", context);

  if ("type" in event) {
    if (event.type === "parallel-executor") {
      console.log("routing event to handleDiscordInteractionFollowup");
      return await handleDiscordInteractionFollowup(event);
    } else {
      throw new Error("Unknown event payload type " + event.type);
    }
  } else {
    console.log("routing event to handleAPIGatewayEvent");
    const resp = await handleAPIGatewayEvent(event);
    console.log("returning response", resp);
    return resp;
  }
};
