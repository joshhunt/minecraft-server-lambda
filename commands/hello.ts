import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import AWS from "aws-sdk";
import { respond } from "../lib/discord.js";

const lambda = new AWS.Lambda();

export default async function handleHelloCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  const lambdaARN = process.env.SELF_LAMBDA_ARN;
  if (!lambdaARN) {
    return respond(
      "Unable to start the server because process.env.SELF_LAMBDA_ARN isn't set!"
    );
  }

  await lambda
    .invokeAsync({
      FunctionName: lambdaARN,
      InvokeArgs: JSON.stringify({
        command: "say Hello, world!",
        discordToken: command.token,
      }),
    })
    .promise();

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: `Hello, world! Invoked ${lambdaARN}` },
  };
}
