import mongoose, { Schema } from "mongoose";

const concentrationIndexSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  concentrationIndex: {
    type: Number,
    required: true,
  },
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
});

export const ConcentrationIndex = mongoose.model("ConcentrationIndex", concentrationIndexSchema);