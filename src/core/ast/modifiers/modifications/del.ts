import Streamable       from '../../../stream';
import {RawType}        from '../../../tokenizer/types';
import {DeleteModifier} from '../../types';

export default (stream: Streamable<RawType>): DeleteModifier => {
    const identifier = require('../identifier');

    const param = identifier(stream);
    if (!param) {
        stream.throwError('Expected identifier');
    }

    return {
        type: 'del',
        param,
    } as DeleteModifier;
}
