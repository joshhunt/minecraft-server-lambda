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

export default async function handleStopServerCommand(
  command: APIApplicationCommandInteraction
): Promise<APIInteractionResponse> {
  const instanceId = process.env.INSTANCE_ID;
  console.log("stopping instance", instanceId);

  if (!instanceId) {
    return respond(
      "Unable to stop the server because process.env.INSTANCE_ID isn't set!"
    );
  }

  const params = {
    InstanceIds: [instanceId],
  };
  console.log("stopping instance with params", params);
  var data = await ec2.stopInstances(params).promise();
  console.log("neat, stopped instance!", data);

  return respond("Okay - I've stopped the server. Goodnight...");
}
