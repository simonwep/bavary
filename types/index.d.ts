declare module 'bavary' {

    /**
     * Compiles a definition-string and returns a function.
     * Returns a function which can be used to parse content with compiled definitions.
     */
    export const compile: (definitions: string) => (content: string) => object | null;

    /**
     * Current version
     */
    export const version: string;
}
