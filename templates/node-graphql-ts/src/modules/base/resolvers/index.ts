import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars";

import { Resolvers } from "../../../types.generated";

const query: Resolvers = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
};

export default query;
