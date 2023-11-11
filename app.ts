import { Handler, APIGatewayEvent } from "aws-lambda";
import { verifyKey } from "discord-interactions";

function respond401(message: string) {
  return {
    statusCode: 401,
    body: JSON.stringify(message),
  };
}

export const handler: Handler<APIGatewayEvent> = async (event, context) => {
  // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  if (!PUBLIC_KEY) {
    throw new Error("PUBLIC_KEY is not defined");
  }

  const signature = event.headers["x-signature-ed25519"];
  if (!signature) return respond401("no signature");

  const timestamp = event.headers["x-signature-timestamp"];
  if (!timestamp) return respond401("no timestamp");

  const strBody = event.body;
  if (!strBody) return respond401("no body");

  const isValidRequest = verifyKey(
    strBody,
    signature,
    timestamp,
    "MY_CLIENT_PUBLIC_KEY"
  );

  if (!isValidRequest) {
    return respond401("invalid request signature");
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: 1 }),
    };
  }
};
