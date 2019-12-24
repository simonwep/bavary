import {check}                                                 from '../tools/check';
import {maybe}                                                 from '../tools/maybe';
import {optional}                                              from '../tools/optional';
import {BinaryExpression, ConditionalStatement, ValueAccessor} from '../types';

module.exports = maybe<ConditionalStatement>(stream => {
    const parseBinaryExpression = require('./binary-expression');
    const parseValueAccessor = require('./value-accessor');
    const parseGroup = require('./group');
    const parseTag = require('./tag');

    if (!optional(stream, false, 'kw', 'if')) {
        return null;
    }

    // User may used the not-keyword to negate the condition
    const negated = !!optional(stream, false, 'kw', 'not');
    let condition: ValueAccessor | BinaryExpression;

    if (check(stream, false, 'punc', '(')) {

        // Binary expression
        condition = parseBinaryExpression(stream);
        if (!condition) {
            stream.throwError('Expected a binary expression.');
        }
    } else {

        // Parse tag
        const tag = parseTag(stream);
        if (!tag) {
            stream.throwError('Expected a tag.');
        }

        condition = {
            type: 'value-accessor',
            value: [tag.value, ...(parseValueAccessor(stream)?.value || [])]
        };
    }

    // Parse then-block
    const then = parseGroup(stream);
    if (!then) {
        stream.throwError('Expected a group.');
    }

    // The else-branch is optional
    let alternative = null;
    if (optional(stream, false, 'kw', 'else')) {
        alternative = parseGroup(stream);

        if (!alternative) {
            stream.throwError('Expected a group.');
        }
    }

    return {
        type: 'conditional-statement',
        condition,
        negated,
        consequent: then,
        alternate: alternative
    } as ConditionalStatement;
});
