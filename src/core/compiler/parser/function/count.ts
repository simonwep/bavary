import {Func, Group, Identifier, Tag} from '../../../ast/types';
import {Streamable}                     from '../../../stream';
import {ParsingResult, Scope}         from '../../types';
import {validateArguments}            from './validate-arguments';

module.exports = (stream: Streamable<string>, decl: Func, scope: Scope, result: ParsingResult): boolean => {
    validateArguments(decl, ['group', 'tag'], 'identifier');

    const [source, tag] = decl.args as [Group | Tag, Identifier];
    const parseGroup = require('../group');
    let rawSource;

    if (source.type === 'tag') {
        rawSource = result.obj[source.value];

        if (!rawSource) {
            throw new Error(`Couldn't resolve tag "${source.value}"`);
        }
    } else {

        // Execute group
        rawSource = parseGroup(stream, source, scope, {
            obj: {},
            str: '',
            pure: false
        });
    }

    if (!Array.isArray(rawSource) && typeof rawSource !== 'string') {
        throw new Error('Count function requires an array or string as source.');
    }

    result.obj[tag.value] = rawSource.length;
    return true;
};
