import Streamable       from '../../../stream';
import {RawType}        from '../../../tokenizer/types';
import expect           from '../../tools/expect';
import {DefineModifier} from '../../types';

export default (stream: Streamable<RawType>): DefineModifier => {
    const identifier = require('../../nodes/identifier');
    const string = require('../../nodes/string');

    const key = identifier(stream);
    if (!key) {
        stream.throwError('Expected identifier');
    }

    expect(stream, 'punc', '=');
    const val = string(stream);

    if (!val) {
        stream.throwError('Expected string');
    }

    return {
        type: 'def',
        key: key.value,
        value: val.value
    } as DefineModifier;
}
