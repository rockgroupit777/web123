const { mergeTypeDefs } = require('@graphql-tools/merge');
import fs from 'fs';
import path from 'path';

// Đọc và gộp schema từ các file nhỏ
const typeDefs = mergeTypeDefs([
  fs.readFileSync(path.join(__dirname, 'user.graphql'), { encoding: 'utf-8' }),
  //fs.readFileSync(path.join(__dirname, 'post.graphql'), { encoding: 'utf-8' }),
]);
export {typeDefs};