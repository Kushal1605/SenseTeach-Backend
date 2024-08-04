import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export const Post = mongoose.model("Post", PostSchema);
