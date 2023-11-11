import { ApplicationCommandType } from "discord-api-types/v10";
import { commands } from "./commands/registry.js";

let url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`;

const headers = {
  Authorization: `Bot ${process.env.BOT_TOKEN}`,
  "Content-Type": "application/json",
};

for (const [name, command] of Object.entries(commands)) {
  console.log("Registering command", name);
  const commandPayload = {
    name: name,
    type: ApplicationCommandType.ChatInput,
    description: command.description,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(commandPayload),
  });

  console.log("Response status", resp.statusText);

  console.log(await resp.json());
}
