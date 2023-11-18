import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  APIMessage,
  InteractionResponseType,
} from "discord-api-types/v10";

import EC2, { DescribeInstanceStatusRequest } from "aws-sdk/clients/ec2";
import Lambda from "aws-sdk/clients/lambda";
import { respond, setFollowup } from "../lib/discord.js";
import {
  createDiscordInteractionFollowupEvent,
  getErrorMessage,
  pollForState,
} from "../lib/lambda.js";

const lambda = new Lambda();
const ec2 = new EC2();

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

  let reply: APIMessage = await setFollowup(
    "Starting server...",
    command.application_id,
    command.token
  );
  console.log("discord reply body", reply);

  try {
    console.log("booting instance", params);
    await ec2.startInstances(params).promise();

    await pollForState(instanceId, "running", async (state) => {
      reply = await setFollowup(
        `Instance is ${state}...`,
        command.application_id,
        command.token,
        reply.id
      );
    });
  } catch (err) {
    console.error("Error starting instance", err);
    const message = getErrorMessage(err);
    await setFollowup(
      "Oopsies, something went wrong:\n" + message,
      command.application_id,
      command.token,
      reply.id
    );
    return;
  }

  await setFollowup(
    `Instance is running. The minecraft server should be available shortly :)`,
    command.application_id,
    command.token,
    reply.id
  );
}
