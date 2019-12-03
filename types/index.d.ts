import {Declaration}    from '../src/core/ast/types';
import {CompilerConfig} from '../src/core/compiler/types';

declare module bavary {

    /**
     * Compiles a definition-string and returns a function.
     * Returns a function which can be used to parse content with compiled definitions.
     */
    export const compile: (
        definitions: string | Array<Declaration>,
        config?: CompilerConfig,
    ) => Parser;

    /**
     * Precompiles a declaration.
     * Can be passed into the compile function / combined with other pre-compiled declarations.
     */
    export const compileChunk: (
        definitions: string
    ) => Array<Declaration>;

    /**
     * Parser function.
     */
    export type Parser = (content: string) => object | null;

    /**
     * Current version
     */
    export const version: string;
}

export = bavary;
export as namespace bavary;
