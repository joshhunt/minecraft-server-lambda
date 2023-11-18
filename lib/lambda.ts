import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { StatusCodes } from "http-status-codes";
import { DiscordInteractionFollowupEvent } from "./types.js";
import EC2, { DescribeInstanceStatusRequest } from "aws-sdk/clients/ec2.js";

const ec2 = new EC2();

export function responseMessage(
  message: string,
  statusCode: number = StatusCodes.OK
) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
}

export function createDiscordInteractionFollowupEvent(
  interaction: APIApplicationCommandInteraction
): DiscordInteractionFollowupEvent {
  return {
    type: "discord-interaction-followup",
    interaction,
  };
}

export function getErrorMessage(err: unknown) {
  if (!err || typeof err !== "object") {
    return "Unknown error";
  }

  if ("message" in err) {
    return err.message;
  }

  if ("toString" in err) {
    return err.toString();
  }

  return "Unknown error";
}

export async function pollForState(
  instanceId: string,
  desiredState: string,
  changeCallback: (state: string) => void | Promise<void>
) {
  let lastStatus = "";

  while (true) {
    const thisStatus = await getInstanceStatus(instanceId);
    console.log("instance status is", thisStatus);

    if (thisStatus != lastStatus) {
      console.log("Status changed", thisStatus);
      await changeCallback(thisStatus);
    }

    lastStatus = thisStatus;

    if (thisStatus == desiredState) {
      break;
    }

    await wait(1000);
  }
}

export async function getInstanceStatus(instanceId: string): Promise<string> {
  const params: DescribeInstanceStatusRequest = {
    InstanceIds: [instanceId],
    IncludeAllInstances: true,
  };

  var data = await ec2.describeInstanceStatus(params).promise();

  const instanceInfo = data.InstanceStatuses?.find(
    (status) => status.InstanceId == instanceId
  );
  if (!instanceInfo) {
    console.warn("Instance not found", instanceId);
    return "Unknown instance";
  }

  return instanceInfo.InstanceState?.Name ?? "Unknown status";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
