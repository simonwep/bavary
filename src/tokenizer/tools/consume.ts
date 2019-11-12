import Streamable from '../../stream';

export default (stream: Streamable<string>, predicate: (str: string) => boolean): string => {
    let result = '';

    while (stream.hasNext() && predicate(stream.peek() as string)) {
        result += stream.next();
    }

    return result;
};
