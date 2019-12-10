import {TokenStream}    from '../../../misc/token-stream';
import {DeleteModifier} from '../../types';

export const parseDeleteModifier = (stream: TokenStream): DeleteModifier => {
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
