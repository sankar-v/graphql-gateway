const express = require('express'),
    fetch = require('node-fetch'),
    app = express(),
    PORT = process.env.PORT || 8081,
    bodyParser = require('body-parser'),
    { graphqlExpress } = require('apollo-server-express'),
    { introspectSchema, makeRemoteExecutableSchema, ApolloServer } = require('apollo-server'),
    { mergeSchemas } = require('graphql-tools'),
    { HttpLink } = require('apollo-link-http');
    
//our graphql endpoints
const uri = 'http://localhost:8082/graphql';

const link = new HttpLink({
    uri: uri,
    fetch
});

// Fetch our schema
const schema =  introspectSchema(link);

// make an executable schema
const executableSchema = makeRemoteExecutableSchema({
    schema: schema,
    link: link
});

const server = new ApolloServer({ schema: executableSchema });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});