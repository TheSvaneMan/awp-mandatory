import { mongoose } from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
  },
});

export const models = [
  {
    name: "Book",
    schema: bookSchema,
    collection: "books",
  },
];
