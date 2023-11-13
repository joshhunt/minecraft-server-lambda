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

export async function stopServerInitialHandler(
  command: APIApplicationCommandInteraction
) {
  const lambdaARN = process.env.SELF_LAMBDA_ARN;
  if (!lambdaARN) {
    return respond("process.env.SELF_LAMBDA_ARN not set :(");
  }

  console.log("invoking lambda....");
  lambda
    .invokeAsync({
      FunctionName: lambdaARN,
      InvokeArgs: JSON.stringify(
        createDiscordInteractionFollowupEvent(command)
      ),
    })
    .promise()
    .then((v) => console.log("successfully invoked lamda", v))
    .catch((err) => console.log("error invoking lamda", err));

  console.log("returning with response");
  return respond(
    "Acknowledged! I'll stop the server and let you know when it's done :)"
  );
}

export async function stopServerAsyncHandler(
  command: APIApplicationCommandInteraction
): Promise<void> {
  console.log("stopServerAsyncHandler");
  const instanceId = process.env.INSTANCE_ID;

  if (!instanceId) {
    throw new Error("INSTANCE_ID is not defined");
  }

  const params = {
    InstanceIds: [instanceId],
  };
  console.log("booting instance", params);
  var data = await ec2.stopInstances(params).promise();
  console.log("responded, sending reply back to discord");

  // TODO: Wait for instance to stop and send more detaild responses

  await setFollowup(
    "Server stopped! good night",
    command.application_id,
    command.token
  );
}
