import {Streamable} from '../../misc/stream';

export const cunsumeWhile = (stream: Streamable<string>, predicate: (str: string) => boolean): string => {
    let result = '';

    while (stream.hasNext() && predicate(stream.peek() as string)) {
        result += stream.next();
    }

    return result;
};
