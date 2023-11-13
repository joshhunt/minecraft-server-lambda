import { Handler, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleAPIGatewayEvent } from "./handlers/apiGateway.js";
import { DiscordInteractionFollowupEvent } from "./lib/types.js";
import { handleDiscordInteractionFollowup } from "./handlers/discordInteractionFollowup.js";

type Event = DiscordInteractionFollowupEvent | APIGatewayEvent;

export const handler: Handler<Event> = async (event, context) => {
  console.log("Lambda recieved event", event);
  console.log("with context", context);

  if ("type" in event) {
    console.log("routing event to handleDiscordInteractionFollowup");
    return await handleDiscordInteractionFollowup(event);
  } else {
    console.log("routing event to handleAPIGatewayEvent");
    return await handleAPIGatewayEvent(event);
  }
};
