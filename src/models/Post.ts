import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

const likeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

const postSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  comments: [commentSchema],
  likes: [likeSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Post", postSchema);
