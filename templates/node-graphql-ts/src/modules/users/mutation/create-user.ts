import { MutationResolvers } from "../../../types.generated";

const createUser: MutationResolvers["createUser"] = async (
  _parent,
  { input },
  ctx,
) => {
  try {
    return await ctx.prisma.user.create({
      data: {
        name: input.name,
        lastName: input.lastName,
        email: input.email,
      },
    });
  } catch (error) {
    throw error instanceof Error ? error.message : JSON.stringify(error);
  }
};

export default createUser;
