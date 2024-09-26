const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/flightBookings', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Booking Schema
const BookingSchema = new mongoose.Schema({
  name: String,
  flightNumber: String,
  date: String,
  offer: String,
});

const Booking = mongoose.model('Booking', BookingSchema);

// GraphQL Schema
const typeDefs = gql`
  type Booking {
    id: ID!
    name: String!
    flightNumber: String!
    date: String!
    offer: String!
  }

  type Query {
    getBookings: [Booking]
  }

  type Mutation {
    addBooking(name: String!, flightNumber: String!, date: String!, offer: String!): Booking
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getBookings: async () => await Booking.find(),
  },
  Mutation: {
    addBooking: async (_, { name, flightNumber, date, offer }) => {
      const booking = new Booking({ name, flightNumber, date, offer });
      await booking.save();
      return booking;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000' + server.graphqlPath);
  });
});
