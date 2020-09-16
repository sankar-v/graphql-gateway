const express = require('express'),
    fetch = require('node-fetch'),
    app = express(),
    PORT = process.env.PORT || 8081,
    bodyParser = require('body-parser'),
    { graphqlExpress } = require('apollo-server-express'),
    { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools'),
    { mergeSchemas } = require('graphql-tools'),
    { HttpLink } = require('apollo-link-http');;

//our graphql endpoints
const endpoints = [
    'http://localhost:8082/graphql',
    'http://localhost:8083/graphql'
];

async function getIntrospectSchema(url) {
    // Create a link to a GraphQL instance by passing fetch instance and url
    const link = new HttpLink({
        uri: url,
        fetch
    });

    // Fetch our schema
    const schema = await introspectSchema(link);

    // make an executable schema
    return makeRemoteExecutableSchema({
        schema: schema,
        link: link
    });
}
const allSchemas  = []
try {
    //promise.all to grab all remote schemas at the same time, we do not care what order they come back but rather just when they finish
    const schema1 = getIntrospectSchema('http://localhost:8082/graphql');
    allSchemas.push(schema1)
    const schema2 = getIntrospectSchema('http://localhost:8083/graphql');
    allSchemas.push(schema2)
    console.log(allSchemas)
    
    //start up a graphql endpoint for our main server
    app.listen(PORT,
        () => console.log('GraphQL API listening on port:' + PORT));
} catch (error) {
    console.log('ERROR: Failed to grab introspection queries', error);
}