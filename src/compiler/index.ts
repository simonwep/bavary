import parseAst     from '../ast';
import {ASTNode}    from '../ast/types';
import Streamable   from '../stream';
import resolveScope from './tools/resolve-scope';

export default (definitions: string): (content: string) => null | object => {
    const typeValue = require('./parser/type-value');
    const tree = parseAst(definitions);

    if (!tree) {
        throw 'Failed to parse declarations';
    }

    // Resolve entities in the global scope
    let entry: ASTNode | null = null;
    const globals = resolveScope(tree, null, ({variant, name, value}) => {
        if (variant === 'entry') {

            // There can only be one entry type
            if (entry) {
                throw `There can only be one entry type. Got "${name}" as second one.`;
            }

            entry = value;
        }
    });

    // Check if entry node is declared
    if (!entry) {
        throw 'Couldn\'t resolve entry type. Use the entry keyword to declare one.';
    }

    return (content: string): null | object => {
        const stream = new Streamable(content);
        const res = typeValue(stream, entry as ASTNode, globals);
        return stream.hasNext() ? null : res;
    };
};
