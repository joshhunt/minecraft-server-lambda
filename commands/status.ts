import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import EC2 from "aws-sdk/clients/ec2";
import Lambda from "aws-sdk/clients/lambda";
import { respond, setFollowup } from "../lib/discord.js";
import { createDiscordInteractionFollowupEvent } from "../lib/lambda.js";

const lambda = new Lambda();
const ec2 = new EC2();

export async function serverStatusInitialHandler(
  command: APIApplicationCommandInteraction
) {
  const instanceId = process.env.INSTANCE_ID;
  if (!instanceId) {
    throw new Error("INSTANCE_ID is not defined");
  }

  const params: EC2.DescribeInstanceStatusRequest = {
    InstanceIds: [instanceId],
    IncludeAllInstances: true,
  };
  console.log("getting status", params);
  var data = await ec2.describeInstanceStatus(params).promise();
  console.log(data);

  const statuses = data.InstanceStatuses?.map(
    (status) => `${status.InstanceId} is ${status.InstanceState?.Name}`
  );

  const statusMessage = statuses?.length ? statuses?.join("\n") : undefined;

  console.log("returning with response");
  return respond(statusMessage ?? "Eek - no statuses found :(");
}
