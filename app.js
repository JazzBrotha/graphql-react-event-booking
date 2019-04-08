const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(
  '/api',
  graphqlHttp({
    schema: buildSchema(`
      type RootQuery {
        events: [String!]!

      }

      type RootMutation {
        createEvent(name: String): String
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }

    `),
    rootValue: {
      events: () => ['Romantic Cooking', 'Sailing', 'All-Night Coding'],
      createEvent: ({ name }) => name
    },
    graphiql: true
  })
);

app.listen(3000);
