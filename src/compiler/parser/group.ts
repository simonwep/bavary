import {Group}                             from '../../ast/types';
import {evalDeclaration}                   from '../internal';
import {NodeValue, NodeVariant, TypedNode} from '../node';
import {serializeParsingResult}            from '../tools/serialize';
import {LocationDataObject, ParserArgs}    from '../types';
import {multiplier}                        from './multiplier';

export const evalGroup = (
    args: Omit<ParserArgs<Group>, 'node'> & {

        // The current node used as parent if group-mode is set,
        // Otherwise inherited and passed to further statements.
        node?: NodeVariant;

        // It's possible to force the process of creating a new node but
        // Setting the parent of it through this variable.
        parent?: NodeVariant;
    }
): NodeValue => {

    // Non-changing props used in multiplier
    const {config, scope, node, parent, decl} = args;

    return multiplier<NodeValue, Group>(({stream}) => {
        stream.stash();

        // Recreate a node through group-mode, node and optional parent
        const subNode = node ? (

            // Create new node with current one as parent, or use current one
            decl.mode ? TypedNode.create(decl.mode, node) : node

            // Make new one with string as fallback and parent as opional parent node
        ) : TypedNode.create(decl.mode || 'string', parent);

        // In case the evaluation fails and the value needs to get be restored
        const previousValue = subNode.value;

        // Remember stream-position in case the locationData-option is set
        const starts = stream.index;

        const decs = decl.value;
        for (let i = 0; i < decs.length; i++) {
            const decl = decs[i];

            // Parse declaration
            if (!evalDeclaration({config, stream, decl, scope, node: subNode})) {

                if (subNode.type === 'object') {

                    // Nullish properties used in this group
                    serializeParsingResult(decs, subNode, true);
                } else {

                    // Restore previous value
                    subNode.value = previousValue as string | Array<NodeValue>;
                }

                stream.pop();
                return null;
            }

            // Check if node should be returned
            if (subNode.returned) {
                break;
            }
        }

        // Serialize only if node dosn't contain a return-statement
        if (!subNode.returned) {

            // Nullish remaining values
            if (subNode.type === 'object') {
                serializeParsingResult(decs, subNode);
            }

            // Add location-data if enabled
            // Save optional start / end labels
            if (config.locationData && subNode.type === 'object') {
                const {end, start} = config.locationData as LocationDataObject;
                subNode.value[start] = starts;
                subNode.value[end] = stream.index;
            }
        }

        stream.recycle();
        return subNode.value;
    })(args as ParserArgs<Group>);
};
