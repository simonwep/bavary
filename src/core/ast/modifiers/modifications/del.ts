import {Streamable}     from '../../../stream';
import {RawType}        from '../../../tokenizer/types';
import {DeleteModifier} from '../../types';

export const parseDeleteModifier = (stream: Streamable<RawType>): DeleteModifier => {
    const valueAccessor = require('../value-accessor');

    const param = valueAccessor(stream);
    if (!param) {
        stream.throwError('Expected a value accessor.');
    }

    return {
        type: 'del',
        param,
    } as DeleteModifier;
};
