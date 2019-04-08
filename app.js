const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());
app.use(
  '/api',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!

      }

      type RootMutation {
        createEvent(event: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }

    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events =>
            events.map(event => {
              return { ...event._doc, _id: event.id };
            })
          )
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createEvent: ({ event: { title, description, price, date } }) => {
        const event = new Event({
          title,
          description,
          price: +price,
          date: new Date().toISOString()
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: event.id };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(`mongodb://localhost/${process.env.MONDO_DB}`)
  .then(() => app.listen(3000))
  .catch(err => console.log(err));
