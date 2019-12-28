import {TokenStream}        from '../../../misc/token-stream';
import {parseValueAccessor} from '../../nodes/value-accessor';
import {DeleteModifier}     from '../../types';

export const parseDeleteModifier = (stream: TokenStream): DeleteModifier => {
    const param = parseValueAccessor(stream);
    if (!param) {
        stream.throwError('Expected a value accessor.');
    }

    return {
        type: 'del',
        param,
    } as DeleteModifier;
};
