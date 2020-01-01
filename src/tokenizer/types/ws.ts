import {Streamable}   from '../../streamable';
import {consumeWhile} from '../tools/consume';
import {isWhiteSpace} from '../tools/is';
import {Token}        from '../types';

export const ws = (stream: Streamable<string>): Token | null => {
    const ws = consumeWhile(stream, isWhiteSpace);

    return ws.length ? {
        type: 'ws',
        value: ws
    } as Token : null;
};
