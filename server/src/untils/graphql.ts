import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";

interface FieldsMap {
  [field: string]: {} | FieldsMap;
}

// Cache to memoize the result of getFieldsMap for each info object
const fieldsMapCache = new WeakMap<GraphQLResolveInfo, FieldsMap>();

const getFieldsMap = (info: GraphQLResolveInfo): FieldsMap => {
  if (!fieldsMapCache.has(info)) {
    const fields = graphqlFields(info, {}, { excludedFields: ["__typename"] });
    fieldsMapCache.set(info, fields);
  }
  return fieldsMapCache.get(info)!;
};

export const hasSubfields = (info: GraphQLResolveInfo): boolean => {
  return Object.values(getFieldsMap(info)).some(subfields => 
    Object.keys(subfields).length > 0
  );
};

export const getFieldsAsString = (info: GraphQLResolveInfo): string => 
  Object.keys(getFieldsMap(info)).join(" ");
