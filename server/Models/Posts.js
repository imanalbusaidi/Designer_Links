import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  postMsg: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
});

const PostModel = mongoose.model("posts", PostSchema);

export default PostModel;