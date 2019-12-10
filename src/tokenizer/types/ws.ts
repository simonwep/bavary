import {Streamable}   from '../../misc/stream';
import {consumeWhile} from '../tools/consume';
import {isWhiteSpace} from '../tools/is';
import {RawType}      from '../types';

export const ws = (stream: Streamable<string>): RawType | null => {
    const ws = consumeWhile(stream, isWhiteSpace);

    return ws.length ? {
        type: 'ws',
        value: ws
    } as RawType : null;
};
