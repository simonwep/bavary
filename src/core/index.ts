import {parseAST}            from './ast';
import {compileDeclarations} from './compiler';
import {Parser}              from './compiler/types';
import {tokenize}            from './tokenizer';

/**
 * Compiles a definition-string.
 * Returns a function which can be used to parse content with compiled definitions.
 */
export const compile = (str: string): Parser => {
    return compileDeclarations(

        // Call ast-parser with array of tokens an provide the source-code in case of errors
        parseAST(tokenize(str), str)
    );
};

/**
 * Current version
 */
export const version = '0.0.4';
