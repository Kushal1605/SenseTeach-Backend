import mongoose from "mongoose";
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
