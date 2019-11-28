import {ENV_VERSION}            from '../env';
import {parseAST}               from './ast';
import {compileDeclarations}    from './compiler';
import {CompilerConfig, Parser} from './compiler/types';
import {tokenize}               from './tokenizer';

/**
 * Compiles a definition-string.
 * Returns a function which can be used to parse content with compiled definitions.
 * @param str Declarations
 * @param config Configuration
 */
export const compile = (str: string, config?: CompilerConfig): Parser => {

    // Call ast-parser with array of tokens an provide the source-code in case of errors
    const tree = parseAST(tokenize(str), str);
    return compileDeclarations(tree, config);
};

/**
 * Current version
 */
export const version = ENV_VERSION;
