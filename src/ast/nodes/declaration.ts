import {TokenStream}                                             from '../../tokenizer/stream/token-stream';
import {parseArguments, parseBlock, parseGroup, parseIdentifier} from '../internal';
import {maybe}                                                   from '../tools/maybe';
import {Declaration}                                             from '../types';

export const parseDeclaration = maybe<Declaration>((stream: TokenStream) => {

    // Parse optional variant
    const variant = stream.optional(false, 'kw', 'entry', 'default', 'export');
    let name = null, args = null;

    // It may be a named one
    if (stream.optional(false, 'punc', '<')) {

        name = parseIdentifier(stream);
        if (!name) {
            stream.throwError('Expected identifier.');
        }

        // Parse arguments
        args = parseArguments(stream);
        stream.expect(false, 'punc', '>');
        stream.expect(false, 'punc', '=');
    } else if (!variant) {
        return null;
    }

    // A declaration value could be either a group or scoped block
    let body;
    if (args?.length) {
        body = parseGroup(stream);

        if (!body) {
            stream.throwError('Expected a group.');
        }
    } else {
        body = parseGroup(stream) || parseBlock(stream);

        if (!body) {
            stream.throwError('Expected a group or block-statement.');
        }
    }

    return {
        type: 'declaration',
        name: name ? name.value : null,
        variant,
        value: body,
        arguments: args
    } as Declaration;
});
