import {Streamable}     from '../../../stream';
import {RawType}        from '../../../tokenizer/types';
import {expect}         from '../../tools/expect';
import {DefineModifier} from '../../types';

export const parseDefineModifier = (stream: Streamable<RawType>): DefineModifier => {
    const valueAccessor = require('../../nodes/value-accessor');
    const string = require('../../nodes/string');
    const identifier = require('../../nodes/identifier');

    const key = identifier(stream);
    if (!key) {
        stream.throwError('Expected identifier');
    }

    expect(stream, 'punc', '=');
    const val = string(stream) || valueAccessor(stream);

    if (!val) {
        stream.throwError('Expected string, function-call or value-accessor.');
    }

    return {
        type: 'def',
        value: val,
        key: key.value
    } as DefineModifier;
};
