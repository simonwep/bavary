import {Streamable}       from '../../streams/streamable';
import {consumeWhile}     from '../tools/consume';
import {isWhiteSpace}     from '../tools/is';
import {Alternate, Token} from '../types';

export const ws = (stream: Streamable<string>): Token | Alternate => {
    const ws = consumeWhile(stream, isWhiteSpace);

    return ws.length ? {
        type: 'ws',
        value: ws
    } as Token : Alternate.FAILED;
};
