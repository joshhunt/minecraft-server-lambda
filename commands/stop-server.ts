import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  APIMessage,
  InteractionResponseType,
} from "discord-api-types/v10";

import EC2 from "aws-sdk/clients/ec2";
import Lambda from "aws-sdk/clients/lambda";
import { respond, setFollowup } from "../lib/discord.js";
import {
  createDiscordInteractionFollowupEvent,
  getErrorMessage,
  pollForState,
} from "../lib/lambda.js";

const lambda = new Lambda();
const ec2 = new EC2();

export async function stopServerInitialHandler(
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

  let reply: APIMessage = await setFollowup(
    "Stopping server...",
    command.application_id,
    command.token
  );
  console.log("discord reply body", reply);

  try {
    console.log("stopping instance", params);
    await ec2.stopInstances(params).promise();

    await pollForState(instanceId, "stopped", async (state) => {
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
    "Server stopped! good night",
    command.application_id,
    command.token,
    reply.id
  );
}
