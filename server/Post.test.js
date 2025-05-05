import mongoose from "mongoose";
import PostModel from "./Models/Posts.js";

describe("PostModel", () => {
  it("should create a post with required fields", () => {
    const post = new PostModel({
      postMsg: "Test post",
      email: "test@example.com",
      category: "Graphic Design",
      userName: "Test User",
    });
    expect(post.postMsg).toBe("Test post");
    expect(post.email).toBe("test@example.com");
    expect(post.category).toBe("Graphic Design");
    expect(post.userName).toBe("Test User");
    expect(post.likes.count).toBe(0);
    expect(Array.isArray(post.likes.users)).toBe(true);
  });
});