import { MutationResolvers } from "../../../types.generated";

const deleteUser: MutationResolvers["deleteUser"] = async (
  _parent,
  { id },
  ctx,
) => {
  try {
    return ctx.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    throw error instanceof Error ? error.message : JSON.stringify(error);
  }
};

export default deleteUser;
