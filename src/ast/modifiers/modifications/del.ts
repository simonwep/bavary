import {Streamable}     from '../../../misc/stream';
import {RawType}        from '../../../tokenizer/types';
import {DeleteModifier} from '../../types';

export const parseDeleteModifier = (stream: Streamable<RawType>): DeleteModifier => {
    const valueAccessor = require('../../nodes/value-accessor');

    const param = valueAccessor(stream);
    if (!param) {
        stream.throwError('Expected a value accessor.');
    }

    return {
        type: 'del',
        param,
    } as DeleteModifier;
};
