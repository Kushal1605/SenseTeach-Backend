import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    meetings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
      },
    ],
  },
  { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);
