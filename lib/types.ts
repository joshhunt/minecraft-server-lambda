import { APIApplicationCommandInteraction } from "discord-api-types/v10";

export interface DiscordInteractionFollowupEvent {
  type: "discord-interaction-followup";
  interaction: APIApplicationCommandInteraction;
}
