import { Resolvers } from "../../../types.generated";
import createUser from "./create-user";
import deleteUser from "./delete-user";
import updateUser from "./update-user";

const mutation: Resolvers = {
  Mutation: {
    createUser,
    updateUser,
    deleteUser,
  },
};

export default mutation;
