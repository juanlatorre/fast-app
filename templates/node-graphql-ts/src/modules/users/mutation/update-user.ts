import { MutationResolvers } from "../../../types.generated";

const updateUser: MutationResolvers["updateUser"] = async (
  _parent,
  { input },
  ctx,
) => {
  try {
    return ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name || undefined,
        lastName: input.lastName || undefined,
        email: input.email || undefined,
      },
    });
  } catch (error) {
    throw error instanceof Error ? error.message : JSON.stringify(error);
  }
};

export default updateUser;
