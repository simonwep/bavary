import {Group}                          from '../../ast/types';
import {evalDeclaration}                from '../internal';
import {Node, NodeValue, ObjectNode}    from '../node';
import {serializeParsingResult}         from '../tools/serialize';
import {LocationDataObject, ParserArgs} from '../types';
import {multiplier}                     from './multiplier';

export const evalGroup = (
    args: Omit<ParserArgs<Group>, 'node'> & {

        // The current node used as parent if group-mode is set,
        // otherwise inherited and passed to further statements.
        node?: Node;

        // It's possible to force the process of creating a new node but
        // setting the parent of it through this variable.
        parent?: Node;
    }
): NodeValue => {

    // Non-changing props used in multiplier
    const {config, scope, node, parent, decl} = args;

    return multiplier<NodeValue, Group>(({stream}) => {
        stream.stash();

        // Recreate a node through group-mode, node and optional parent
        const subNode = node ? (

            // Create new node with current one as parent, or use current one
            decl.mode ? Node.create(decl.mode, node) : node

            // Make new one with string as fallback and parent as opional parent node
        ) : Node.create(decl.mode || 'string', parent);

        // In case the evaluation fails and the value needs to get be restored
        const previousValue = subNode.value;

        // Remember stream-position in case the locationData-option is set
        const starts = stream.index;

        const decs = decl.value;
        for (let i = 0; i < decs.length; i++) {
            const decl = decs[i];

            // Parse declaration
            if (!evalDeclaration({config, stream, decl, scope, node: subNode})) {

                if (subNode instanceof ObjectNode) {

                    // Nullish properties used in this group
                    serializeParsingResult(decs, subNode, true);
                } else {

                    // Restore previous value
                    subNode.value = previousValue as string | Array<NodeValue>;
                }

                stream.pop();
                return null;
            }
        }

        // Nullish remaining values
        if (subNode instanceof ObjectNode) {
            serializeParsingResult(decs, subNode);
        }

        // Add location-data if enabled
        // Save optional start / end labels
        if (config.locationData && subNode instanceof ObjectNode) {
            const {end, start} = config.locationData as LocationDataObject;
            subNode.value[start] = starts;
            subNode.value[end] = stream.index;
        }

        stream.recycle();
        return subNode.value;
    })(args as ParserArgs<Group>);
};
