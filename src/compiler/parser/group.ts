import {Group}                          from '../../ast/types';
import {evalDeclaration}                from '../internal';
import {Node, NodeValue, ObjectNode}    from '../node';
import {serializeParsingResult}         from '../tools/serialize';
import {LocationDataObject, ParserArgs} from '../types';
import {multiplier}                     from './multiplier';

export const evalGroup = (
    args: Omit<ParserArgs<Group>, 'node'> & {
        node?: Node;
        parent?: Node;
    }
): NodeValue => {

    // Non-changing props used in multiplier
    const {config, scope, node, parent, decl} = args;

    return multiplier<NodeValue, Group>(({stream}) => {
        stream.stash();

        // Use passed value, create new out of the current mode or string as default
        const subNode = node ? (
            decl.mode ?
                Node.create(decl.mode, node) :
                node
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
