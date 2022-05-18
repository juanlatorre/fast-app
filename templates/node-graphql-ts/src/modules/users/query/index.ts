import { Resolvers } from "../../../types.generated";
import user from "./user";
import users from "./users";

const query: Resolvers = {
  Query: {
    user,
    users,
  },
};

export default query;
