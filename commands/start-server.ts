import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import AWS from "aws-sdk";
import { respond, setFollowup } from "../lib/discord.js";
import { createDiscordInteractionFollowupEvent } from "../lib/lambda.js";

const lambda = new AWS.Lambda();
const ec2 = new AWS.EC2();

export async function startServerInitialHandler(
  command: APIApplicationCommandInteraction
) {
  const lambdaARN = process.env.SELF_LAMBDA_ARN;
  if (!lambdaARN) {
    return respond("process.env.SELF_LAMBDA_ARN not set :(");
  }

  console.log("invoking lambda....");
  await lambda
    .invokeAsync({
      FunctionName: lambdaARN,
      InvokeArgs: JSON.stringify(
        createDiscordInteractionFollowupEvent(command)
      ),
    })
    .promise();

  console.log("returning with response");
  return respond(
    "Acknowledged! I'll start the server and let you know when it's ready :)"
  );
}

export async function startServerAsyncHandler(
  command: APIApplicationCommandInteraction
): Promise<void> {
  console.log("startServerAsyncHandler");
  const instanceId = process.env.INSTANCE_ID;

  if (!instanceId) {
    throw new Error("INSTANCE_ID is not defined");
  }

  const params = {
    InstanceIds: [instanceId],
  };
  console.log("booting instance", params);
  var data = await ec2.startInstances(params).promise();
  console.log("responded, sending reply back to discord");

  await setFollowup("Server started!", command.application_id, command.token);
}
