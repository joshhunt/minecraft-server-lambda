import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { responseMessage } from "../lib/lambda.js";
import { StatusCodes } from "http-status-codes";
import { interactionResponse } from "../lib/discord.js";
import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { dispatchCommand } from "../commands/dispatch.js";
import { verifyKey } from "discord-interactions";

export async function handleAPIGatewayEvent(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
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

  const isValidRequest = verifyKey(strBody, signature, timestamp, PUBLIC_KEY);

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
}
