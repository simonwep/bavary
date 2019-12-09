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

    // Inject argument into scope
    // TODO: Check if arguments count match / default is specified
    if (decl.arguments) {


        for (const {value, name} of decl.arguments) {

            // TODO: Check if scope already contains this type
            if (value) {
                newScope.entries.set(name, {
                    type: 'value',
                    value
                });
            }
        }
    }

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
