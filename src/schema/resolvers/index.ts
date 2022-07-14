import { userMutations } from "./users";
import { postsQueries, postsMutations, postSubscriptions } from "./posts";
import { commentMutations } from "./comments";

export default {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsQueries,
  },
  Mutation: {
    ...userMutations,
    ...postsMutations,
    ...commentMutations,
  },
  Subscription: {
    ...postSubscriptions,
  },
};
