import { Types } from "mongoose";

/* ENUMS ---------------------------------------------------------------- */
export enum AddictionEnum {
  NONE = "NONE",
  ALCOHOL = "ALCOHOL",
  ATTENTION_SEEKING = "ATTENTION_SEEKING",
  BAD_LANGUAGE = "BAD_LANGUAGE",
  CAFFEINE = "CAFFEINE",
  DAIRY = "DAIRY",
  DRUG = "DRUG",
  FAST_FOOD = "FAST_FOOD",
  GAMBLING = "GAMBLING",
  NAIL_BITING = "NAIL_BITING",
  PORN = "PORN",
  PROCRASTINATION = "PROCRASTINATION",
  SELF_HARM = "SELF_HARM",
  SMOKING = "SMOKING",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  SOFT_DRINKS = "SOFT_DRINKS",
  SUGAR = "SUGAR",
  VAPING = "VAPING",
}

export enum SeverityEnum {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

/* INTERFACES ----------------------------------------------------------- */

//TODO: adicionar os tipos aqui para os resolvers. Falta tudo dentro dessas interfaces vê onde elas sao usadas com ctrl shift f

export interface createAddictionInput {}
export interface updateAddictionInput {
  id: Types.ObjectId;
}
export interface createAddictionInput {}

export interface IAddictionModel {
  id: Types.ObjectId;
  type: AddictionEnum;

  symptoms: string[];
  treatmentOptions: string[];
  severity: SeverityEnum;
  triggers: string[];
  copingMechanisms: string[];
}
