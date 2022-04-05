import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
    validate: {
      validator: title => title !== '',
      message: `Title cannot be an empty`
    }
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
    minLength: [10, "That's too short"],
    maxLength: [800, "That's too long"],
  },
  description: {
    type: String,
    required: true,
    minLength: [5, "That's too short"],
    maxLength: [240, "That's too long"],
  },
  tags: [{type: String, minLenght: [1, "That is too shorts"], maxLength: [8, "That is too long"], lowercase: true}],
  favorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
});

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
];
