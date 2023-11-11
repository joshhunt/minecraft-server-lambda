import { Handler, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { verifyKey } from "discord-interactions";
import {
  InteractionType,
  type APIInteraction,
  InteractionResponseType,
} from "discord-api-types/v10";
import { interactionResponse } from "./lib/discord.js";
import { StatusCodes } from "http-status-codes";
import { dispatchCommand } from "./commands/dispatch.js";

function responseMessage(message: string, statusCode: number = StatusCodes.OK) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
}

export const handler: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (
  event,
  context
): Promise<APIGatewayProxyResult> => {
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  if (!PUBLIC_KEY) {
    throw new Error("PUBLIC_KEY is not defined");
  }

  const signature = event.headers["x-signature-ed25519"];
  if (!signature)
    return responseMessage("no signature", StatusCodes.BAD_REQUEST);

  const timestamp = event.headers["x-signature-timestamp"];
  if (!timestamp)
    return responseMessage("no timestamp", StatusCodes.BAD_REQUEST);

  const strBody = event.body;
  if (!strBody) return responseMessage("no body", StatusCodes.BAD_REQUEST);

  const isValidRequest = verifyKey(
    strBody,
    signature,
    timestamp,
    "MY_CLIENT_PUBLIC_KEY"
  );

  if (!isValidRequest) {
    return responseMessage("invalid signature", StatusCodes.UNAUTHORIZED);
  }

  const body = JSON.parse(strBody) as APIInteraction;

  if (body.type == InteractionType.Ping) {
    return interactionResponse({
      type: InteractionResponseType.Pong,
    });
  }

  if (body.type == InteractionType.ApplicationCommand) {
    console.log("Received command", body);
    const result = await dispatchCommand(body);

    if (result) {
      return interactionResponse(result);
    } else {
      return responseMessage(
        "no handler for this command",
        StatusCodes.NOT_FOUND
      );
    }
  }

  return responseMessage(
    "don't know how to handle this",
    StatusCodes.BAD_REQUEST
  );
};
