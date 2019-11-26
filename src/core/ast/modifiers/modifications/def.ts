import Streamable       from '../../../stream';
import {RawType}        from '../../../tokenizer/types';
import expect           from '../../tools/expect';
import {DefineModifier} from '../../types';

export default (stream: Streamable<RawType>): DefineModifier => {
    const valueAccessor = require('../value-accessor');
    const identifier = require('../identifier');
    const string = require('../../nodes/string');

    const key = identifier(stream);
    if (!key) {
        stream.throwError('Expected identifier');
    }

    expect(stream, 'punc', '=');
    const val = string(stream) || valueAccessor(stream);

    if (!val) {
        stream.throwError('Expected string or value-accessor.');
    }

    return {
        type: 'def',
        value: val,
        key
    } as DefineModifier;
}
