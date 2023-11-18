import { APIGatewayEvent } from "aws-lambda";

export interface DiscordInteractionParallelEvent {
  type: "parallel-executor";
  // interaction: APIApplicationCommandInteraction;
  eventPayload: APIGatewayEvent;
}
