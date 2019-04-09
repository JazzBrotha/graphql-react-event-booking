const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./api/schema/index');
const graphqlResolvers = require('./api/resolvers/index');

const app = express();

app.use(bodyParser.json());
app.use(
  '/api',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(`mongodb://localhost/${process.env.MONDO_DB}`)
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
