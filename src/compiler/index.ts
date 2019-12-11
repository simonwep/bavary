import {Declaration}            from '../ast/types';
import {Streamable}             from '../misc/stream';
import {Scope}                  from './scope';
import {CompilerConfig, Parser} from './types';

/**
 * Compiles a pre-calcuated set of declarations.
 * Should only be used internally.
 * @param tree
 * @param config
 */
export const compileDeclarations = (
    tree: Array<Declaration>,
    config: CompilerConfig = {
        locationData: false,
        functions: {}
    }
): Parser => {
    const group = require('./parser/group');

    // Resolve sub-scopes
    const globalScope = new Scope({global: true});
    globalScope.registerAll(tree);

    // Set default starts, and ends values on locationData config option
    if (config.locationData === true) {
        config.locationData = {
            start: '__starts',
            end: '__ends'
        };
    }

    // Pick entry type
    const entry = globalScope.lookupEntry();

    // Check if entry node is declared
    if (!entry) {
        throw new Error('Couldn\'t resolve entry type. Use the entry keyword to declare one.');
    }

    const [decl, scope] = entry;
    return (content: string): null | object => {

        // Parse and return result if successful
        const stream = new Streamable(content);
        const res = group({
            config,
            stream,
            decl: decl.value,
            scope
        });

        return stream.hasNext() ? null : res;
    };
};
