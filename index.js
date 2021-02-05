const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { RESTDataSource, RequestOptions } = require('apollo-datasource-rest');


// https://www.apollographql.com/docs/apollo-server/data/data-sources/
class ModRSAPI extends RESTDataSource {

  willSendRequest(request) {
    console.log("Setting headers context: %o", this.context);
    request.headers.set('x-okapi-tenant', this.context['okapi-tenant']);
    request.headers.set('x-okapi-token', this.context['okapi-token']);
  }

  constructor(baseURL) {
    super();
    this.baseURL = baseURL;
  }

  async getAgreement(id) {
    console.log("getAgreement()");
    return this.get(`sas/${id}`);
  }

  async getAgreements() {
    console.log("getAgreements()");
    return this.get(`sas`);
  }

}


// Access environment variables with
// process.env.VAR_NAME
//
// MOD_AGREEMENTS_URL=http://localhost:9130/erm
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
    name: String
    description: String
  }

  extend type Query {
    agreements: [Agreement]
    agreement(id: String!): Agreement
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
// https://spectrum.chat/apollo/apollo-federation/issue-using-datasources-with-buildfederatedschema~a6b99f47-bced-422d-9bfa-55c900f5f0bc
// https://medium.com/wehkamp-techblog/using-headers-with-apollo-datasources-1c4c019d080c
// https://github.com/apollographql/apollo-server/issues/3558
// 
const resolvers = {
  Query: {
    // agreements: async (_source, _args, { req, dataSources }) => {
    agreements: async (_source, _args, context, info ) => {
      console.log("_source %o ", _source );
      console.log("_args %o ", _args );
      console.log("agreements resolver context=%o ", context );
      console.log("agreements resolver info=%o", info);
      // return dataSources.modRsAPI.getAgreements();
      return context.dataSources.modRsAPI.getAgreements();
    },
    agreement: async (_source, { id }, { req, dataSources }) => {
      return dataSources.modRsAPI.getAgreement(id);
    },
  },
};

// const server = new ApolloServer({ typeDefs, resolvers });
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer( {
  dataSources: () => {
    return {
      modRsAPI: new ModRSAPI(mod_agreements_endpoint)
    };
  },
  schema : buildFederatedSchema([ {
             typeDefs, 
             resolvers
           }]),
  context:  (ctx) => {
               console.log("req: %o",ctx.req.headers);
               return {
                 "okapi-token": ctx.req.headers['x-okapi-token'],
                 "okapi-tenant": ctx.req.headers['x-okapi-tenant'],
               }
             }

});


// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  ERM-Graphql-Ambassador ready at ${url}`);
});

