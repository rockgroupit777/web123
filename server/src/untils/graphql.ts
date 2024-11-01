import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

interface FieldsMap {
  [field: string]: FieldsMap | true; // Use `true` to signify the field is present without additional structure
}

// Cache to memoize the result of getFieldsMap for each info object
const fieldsMapCache = new WeakMap<GraphQLResolveInfo, FieldsMap>();

/**
 * Extracts the fields map from the GraphQL resolver info.
 * Utilizes caching to avoid recomputation for the same info object.
 *
 * @param info - The GraphQLResolveInfo object from the resolver context.
 * @returns A FieldsMap representing the fields in the query.
 */
const getFieldsMap = (info: GraphQLResolveInfo): FieldsMap => {
  if (!fieldsMapCache.has(info)) {
    // Extract fields using graphql-fields, excluding __typename
    const fields = graphqlFields(info, {}, { excludedFields: ['__typename'] });
    fieldsMapCache.set(info, fields);
  }
  return fieldsMapCache.get(info)!;
};

/**
 * Checks if there are any subfields in the GraphQL query.
 *
 * @param info - The GraphQLResolveInfo object from the resolver context.
 * @returns True if there are subfields, otherwise false.
 */
export const hasSubfields = (info: GraphQLResolveInfo): boolean => {
  const fieldsMap = getFieldsMap(info);
  return Object.values(fieldsMap).some(subfields => 
    typeof subfields === 'object' && Object.keys(subfields).length > 0
  );
};

/**
 * Retrieves the fields as a space-separated string.
 *
 * @param info - The GraphQLResolveInfo object from the resolver context.
 * @returns A string of field names.
 */
export const getFieldsAsString = (info: GraphQLResolveInfo): string => 
  Object.keys(getFieldsMap(info)).join(' ');

