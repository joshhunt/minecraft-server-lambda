import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import * as AWS from "aws-sdk";

const ec2 = new AWS.EC2();

function respond(message: string): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: message },
  };
}

export default async function handleStopServerCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  const instanceId = process.env.INSTANCE_ID;

  if (!instanceId) {
    return respond(
      "Unable to stop the server because process.env.INSTANCE_ID isn't set!"
    );
  }

  const params = {
    InstanceIds: [instanceId],
  };
  var data = await ec2.stopInstances(params).promise();

  return respond("Okay - I've stopped the server. Goodnight...");
}
