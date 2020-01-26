import {Declaration, Group}     from '../ast/types';
import {Streamable}             from '../streams/streamable';
import {evalGroup}              from './internal';
import {NodeValue}              from './node';
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
    const entry = globalScope.lookup('entry');

    // Check if entry value is declared
    if (!entry) {
        throw new Error('Couldn\'t resolve entry type. Use the entry keyword to declare one.');
    }

    const [decl, scope] = entry;
    return (content: string): null | NodeValue => {

        // Create content-stream
        const stream = new Streamable(content);

        // Execute entry group statement
        const res = evalGroup({
            decl: decl.value as Group,
            config,
            stream,
            scope
        });

        return stream.hasNext() ? null : res;
    };
};
