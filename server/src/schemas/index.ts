import { mergeTypeDefs } from '@graphql-tools/merge';
import fs from 'fs';
import path from 'path';

// Function to read a GraphQL schema file
const readSchemaFile = (filename: string):string => {
    return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf-8' });
};

// Merge schemas from files
const typeDefs = mergeTypeDefs([
    readSchemaFile('user.graphql'),
    // readSchemaFile('post.graphql'), // Uncomment to include post schema
]);

export { typeDefs };
