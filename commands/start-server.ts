import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

import AWS from "aws-sdk";

const ec2 = new AWS.EC2();

function respond(message: string): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: message },
  };
}

export default async function handleStartServerCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  const instanceId = process.env.INSTANCE_ID;

  if (!instanceId) {
    return respond(
      "Unable to start the server because process.env.INSTANCE_ID isn't set!"
    );
  }

  const params = {
    InstanceIds: [instanceId],
  };
  var data = await ec2.startInstances(params).promise();

  return respond(
    "Okay - I've started the server. It should be ready in a bit :)"
  );
}