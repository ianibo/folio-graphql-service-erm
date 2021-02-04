const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');


// Access environment variables with
// process.env.VAR_NAME
const port = 4001;
const mod_agreements_endpoint = process.env.MOD_AGREEMENTS_URL

if ( ( mod_agreements_endpoint == null ) ||
     ( mod_agreements_endpoint.length == 0 ) ) {
  console.log("MOD_AGREEMENTS_URL environment variable not set");
  process.exit(1);
}

console.log(`ERM url: ${mod_agreements_endpoint}`);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Agreement @key(fields: "id") {
    id: ID!
    title: String
  }

  extend type Query {
    agreements: [Agreement]
  }
`;

const agreements = [
  {
    id: 1,
    title: 'The Awakening'
  },
  {
    id: 2,
    title: 'City of Glass'
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    agreements: () => agreements,
  },
};

// const server = new ApolloServer({ typeDefs, resolvers });
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer( {
  schema : buildFederatedSchema([{typeDefs, resolvers}])
});


// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  ERM-Graphql-Ambassador ready at ${url}`);
});

