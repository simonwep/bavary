import {Streamable} from '../../misc/stream';

export const consumeWhile = (stream: Streamable<string>, predicate: (str: string, cur: string) => boolean): string => {
    let result = '';

    while (stream.hasNext() && predicate(stream.peek() as string, result)) {
        result += stream.next();
    }

    return result;
};
