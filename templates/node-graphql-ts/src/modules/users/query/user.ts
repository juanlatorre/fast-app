import { QueryResolvers } from "../../../types.generated";

const user: QueryResolvers["user"] = async (_parent, { id }, ctx) => {
  return await ctx.prisma.user.findUnique({
    where: {
      id,
    },
    rejectOnNotFound: true,
  });
};

export default user;
