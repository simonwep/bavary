import {TokenStream}                            from '../../tokenizer/token-stream';
import {parseArguments, parseBlock, parseGroup} from '../internal';
import {maybe}                                  from '../tools/maybe';
import {Declaration}                            from '../types';

export const parseDeclaration = maybe<Declaration>((stream: TokenStream) => {

    // Parse optional variant
    const variant = stream.optional('kw', 'entry', 'default', 'export');
    let name = null, args = null;

    // It may be a named one
    if (stream.optional('punc', '<')) {
        name = stream.expect('kw');

        // Parse arguments
        args = parseArguments(stream);
        stream.expect('punc', '>');
        stream.expect('punc', '=');
    } else if (!variant) {
        return null;
    }

    // A declaration value could be either a group or scoped block
    let body;
    if (args?.length) {
        body = parseGroup(stream);

        if (!body) {
            stream.throw('Expected a group.');
        }
    } else {
        body = parseGroup(stream) || parseBlock(stream);

        if (!body) {
            stream.throw('Expected a group or block-statement.');
        }
    }

    return {
        type: 'declaration',
        name: name || null,
        variant,
        value: body,
        arguments: args
    } as Declaration;
});
