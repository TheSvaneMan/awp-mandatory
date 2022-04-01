import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
  },
  language: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
    maxLength: [100, "That's too long"],
  },
  code: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
    maxLength: [120, "That's too long"],
  },
  description: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
    maxLength: [80, "That's too long"],
  },
  favorite: {
    type: Boolean
  },
  uploaded: {
    type: Date
  }
});

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
];
