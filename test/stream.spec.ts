import {expect}     from 'chai';
import {Streamable} from '../src/streams/streamable';

describe('Streams', () => {
    const stream = new Streamable('Hello');

    it('Should peek the next item without increasing the cursor', () => {
        expect(stream.peek()).to.equal('H');
        expect(stream.index).to.equal(0);
    });

    it('Should properly stash two times', () => {

        // Stash index and skip a few
        stream.stash();
        expect(stream.next()).to.equal('H');
        expect(stream.next()).to.equal('e');

        // Stash again
        stream.stash();
        expect(stream.next()).to.equal('l');
    });

    it('Should restore the first, stashed position', () => {
        stream.pop();
        expect(stream.next()).to.equal('l');
    });

    it('Should restore the second, stashed position', () => {
        stream.pop();
        expect(stream.next()).to.equal('H');
    });

    it('Should return true for hasNext()', () => {
        expect(stream.hasNext()).to.equal(true);

        // Skip to last item
        stream.next();
        stream.next();
        stream.next();
    });

    it('Should return null for peek and throw an error on next if there are no items left', () => {
        expect(stream.next()).to.equal('o');
        expect(stream.peek()).to.equal(null);
        expect(() => stream.next()).to.throw();
    });

    it('Should return false for hasNext as there are no items left', () => {
        expect(stream.hasNext()).to.equal(false);
    });
});
