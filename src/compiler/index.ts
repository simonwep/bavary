import parseAst   from '../ast';
import Streamable from '../stream';

const resolveScope = require('./tools/resolve-scope');
const typeValue = require('./parser/type-value');

export default (definitions: string): (content: string) => null | object => {
    const tree = parseAst(definitions);
    let entry = null;

    // Resolve entities in the global scope
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
        const res = typeValue(stream, entry, globals);
        return stream.hasNext() ? null : res;
    };
};
