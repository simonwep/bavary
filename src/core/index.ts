import compiler from './compiler';

/**
 * Compiles a definition-string and returns a function.
 * Returns a function which can be used to parse content with compiled definitions.
 */
export const compile = compiler;

/**
 * Current version
 */
export const version = '0.0.4';
