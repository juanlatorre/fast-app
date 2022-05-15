import { gql, registerModule } from "../../app";

export const UsersModule = registerModule(
  gql`
    type User {
      id: ID!
      name: String!
      lastName: String!
      email: String!
      createdAt: DateTime!
      updatedAt: DateTime
      deletedAt: DateTime
    }

    input CreateUserInput {
      name: String!
      lastName: String!
      email: String!
    }

    input UpdateUserInput {
      id: ID!
      name: String
      lastName: String
      email: String
    }

    extend type Query {
      user(id: ID!): User!
      users: [User!]!
    }

    extend type Mutation {
      createUser(input: CreateUserInput!): User!
      updateUser(input: UpdateUserInput!): User!
      deleteUser(id: ID!): User
    }
  `,
  {
    id: "UsersModule",
    resolvers: {
      Query: {
        async user(_root, { id }, ctx) {
          return await ctx.prisma.user.findUnique({
            where: {
              id,
            },
            rejectOnNotFound: true,
          });
        },
        async users(_root, _args, ctx) {
          return await ctx.prisma.user.findMany({
            orderBy: {
              id: "asc",
            },
          });
        },
      },
      Mutation: {
        async createUser(_root, { input: { name, lastName, email } }, ctx) {
          try {
            return await ctx.prisma.user.create({
              data: {
                name,
                lastName,
                email,
              },
            });
          } catch (error) {
            throw error instanceof Error
              ? error.message
              : JSON.stringify(error);
          }
        },
        async updateUser(_root, { input }, ctx) {
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
            throw error instanceof Error
              ? error.message
              : JSON.stringify(error);
          }
        },
        async deleteUser(_root, { id }, ctx) {
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
            throw error instanceof Error
              ? error.message
              : JSON.stringify(error);
          }
        },
      },
    },
  },
);
