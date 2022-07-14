import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Post } from "../../models";
import checkAuth from "../../utils/check-auth";

const createComment = async (_, { body, postId }, context) => {
  const { username } = checkAuth(context);
  if (body.trim() === "") {
    throw new UserInputError("Comment must not be empty", {
      errors: {
        comment: "Comment must not be empty",
      },
    });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    post.comments.unshift({
      body,
      username,
      createdAt: new Date().toISOString(),
    });
    await post.save();
    return post;
  } catch (err) {
    throw new Error(err as string);
  }
};

const deleteComment = async (_, { postId, commentId }, context) => {
  interface Object {
    [key: string]: string;
  }
  const { username } = checkAuth(context);

  const post = await Post.findById(postId);
  if (!post) {
    throw new UserInputError("Post not found");
  }
  const comment = post.comments.find(
    (comment: Object) => comment.id === commentId
  );
  if (!comment) {
    throw new UserInputError("Comment not found");
  }
  if (comment.username !== username) {
    throw new AuthenticationError("Not authorized");
  }
  post.comments = post.comments.filter(
    (comment: Object) => comment.id !== commentId
  );
  await post.save();
  return post;
};

const likePost = async (_, { postId }, context) => {
  const { username } = checkAuth(context);
  const post = await Post.findById(postId);
  if (!post) {
    throw new UserInputError("Post not found");
  }
  if (post.likes.find((like) => like.username === username)) {
    post.likes = post.likes.filter((like) => like.username !== username);
  } else {
    post.likes.push({
      username,
      createdAt: new Date().toISOString(),
    });
  }
  await post.save();
  return post;
};

export const commentMutations = {
  createComment,
  deleteComment,
  likePost,
};
