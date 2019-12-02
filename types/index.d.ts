import {CompilerConfig} from '../src/core/compiler/types';

declare module bavary {

    /**
     * Compiles a definition-string and returns a function.
     * Returns a function which can be used to parse content with compiled definitions.
     */
    export const compile: (
        definitions: string,
        config?: CompilerConfig,
    ) => (content: string) => object | null;

    /**
     * Current version
     */
    export const version: string;
}

export = bavary;
export as namespace bavary;
