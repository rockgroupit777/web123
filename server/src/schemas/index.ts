import { mergeTypeDefs } from '@graphql-tools/merge';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __filename and __dirname equivalents in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read a GraphQL schema file
const readSchemaFile = (filename: string): string => {
    return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf-8' });
};

// Merge schemas from files
const typeDefs = mergeTypeDefs([
    readSchemaFile('user.graphql'),
    // Uncomment to include additional schemas
    // readSchemaFile('post.graphql'),
]);

export { typeDefs };
