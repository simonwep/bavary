import {Reference}                            from '../../ast/types';
import {resolveReference}                     from '../tools/resolve-scope';
import {ParserArgs, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                      from './multiplier';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): ParsingResultObjectValue => {
    const group = require('./group');

    // Resolve reference
    const res = resolveReference(scope, decl);

    if (!res) {
        throw new Error(`Failed to resolve "${decl.value.join(':')}".`);
    }

    const [newScope, targetBody] = res;

    // Type may have a multiplier attached to it
    return maybeMultiplier<ParsingResultObjectValue, Reference>(
        () => group({
            config,
            stream,
            decl: targetBody,
            scope: newScope
        })
    )({
        config, stream, decl, result,
        scope: newScope
    });
};
