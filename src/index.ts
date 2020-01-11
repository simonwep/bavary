import {parse}                  from './ast';
import {Declaration}            from './ast/types';
import {compileDeclarations}    from './compiler';
import {CompilerConfig, Parser} from './compiler/types';
import {ENV_VERSION}            from './env';
import {tokenize}               from './tokenizer';

// Export parsing-error
export {ParsingError} from './streams/parsing-error';

/**
 * Compiles a definition-string.
 * Returns a function which can be used to parse content with compiled definitions.
 * @param input String or array of pre-compiled declarations.
 * @param config Configuration
 */
export const compile = (input: string | Array<Declaration>, config?: CompilerConfig): Parser => {

    // Use precompiled declarations or compile raw string
    const tree = Array.isArray(input) ? input : parse(tokenize(input), input);
    return compileDeclarations(tree, config);
};

/**
 * Precompiles a declaration.
 * Can be passed into the compile function / combined with other pre-compiled declarations.
 * @param str Declarations
 */
export const compileChunk = (str: string): Array<Declaration> => parse(tokenize(str), str);

/**
 * Current version
 */
export const version = ENV_VERSION;
