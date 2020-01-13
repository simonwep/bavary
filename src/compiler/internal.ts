export * from './parser/character-selection';
export * from './parser/combinator';
export * from './parser/conditional-statement';
export * from './parser/statement';
export * from './parser/function';
export * from './parser/group';
export * from './parser/reference';
export * from './parser/resolve-reference';
export * from './parser/string';
export * from './parser/spread';

/**
 * Every property inside of an object-groups gets serialized e.g. set to null either
 * if the group fails or define-statements weren't reached. Therefore properties can't be practically
 * removed, if a property is set to this symbol it'll removed during serialization.
 */
export const REMOVED_PROPERTY = Symbol('Removed property');
