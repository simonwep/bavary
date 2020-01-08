import {Declaration, Group} from '../ast/types';

export type SpecialMember = 'entry' | 'default';

export class Scope {

    // Optional parent scope
    private readonly parent: Scope | null;

    // If scope defines global scope, not everything is possible in there!
    private readonly global: boolean;

    // Exported members
    private readonly exports: Map<string, Declaration | Scope>;

    // Declared members (without any variant)
    private readonly members: Map<string, Declaration | Scope>;

    // Special members (entry & default)
    private readonly specials: Map<SpecialMember, Declaration | Scope>;

    /**
     * Creates a new scope
     * @param parent Optional parent scope to inherit
     * @param global If this is the global scope
     */
    constructor({parent = null, global = false}: {
        parent?: Scope | null;
        global?: boolean;
    }) {
        this.exports = new Map();
        this.members = new Map();
        this.specials = new Map();
        this.parent = parent;
        this.global = global;
    }

    /**
     * Registers declarations into the current scope
     * @param decs
     */
    public registerAll(decs: Array<Declaration>): void {
        for (const dec of decs) {
            this.register(dec);
        }
    }

    /**
     * Registers a single declaration
     * @param dec
     */
    public register(dec: Declaration): void {
        const resolved = this.resolveValueFor(dec);

        switch (dec.variant) {
            case 'entry': {
                if (this.specials.has('entry')) {
                    throw new Error('There can only be one entry.');
                } else if (!this.global) {
                    throw new Error('Only the global scope can contain entries.');
                }

                // It may be a named entry
                if (dec.name !== null) {
                    this.setMember(dec.name, resolved);
                }

                this.specials.set('entry', resolved);
                break;
            }
            case 'default': {

                if (this.specials.has('default')) {
                    throw new Error('There can only be one default export.');
                } else if (this.global) {
                    throw new Error('The global scope can\'t have default exports.');
                }

                // It may be a named default export
                if (dec.name !== null) {
                    this.setMember(dec.name, resolved);
                }

                this.specials.set('default', resolved);
                break;
            }
            case 'export': {
                const name = dec.name as string;

                if (this.global) {
                    throw new Error('The global scope can\'t have exported members.');
                }

                this.exports.set(name, resolved);
                this.setMember(dec.name as string, resolved);
                break;
            }
            default: {
                this.setMember(dec.name as string, resolved);
                break;
            }
        }
    }

    /**
     * Removes a member by its name from the scope
     * @param name
     */
    public unregister(name: string): boolean {
        return this.members.delete(name);
    }

    /**
     * Injects a declaration into the current scope
     * @param value
     * @param name
     */
    public injectValue(value: Group, name: string): void {
        this.register({
            type: 'declaration',
            variant: null,
            arguments: null,
            value,
            name,
        });
    }

    /**
     * Looks up a reference-path
     * @param path
     */
    public lookupByPath(path: Array<string>): [Declaration, Scope] | null {
        const [cur, ...followUps] = path;

        // Resolve first type upwards
        const val = this.lookupByName(cur);

        if (!val) {
            return null;
        } else if (val instanceof Scope) {
            return val.lookupDeepReference(followUps);
        } else if (!followUps.length) {
            return [val, this];
        }

        return null;
    }

    /**
     * Lookups special-types of declarations
     * @param type
     */
    public lookup(type: SpecialMember): [Declaration, Scope] | null {
        const entry = this.specials.get(type);

        if (entry) {
            return entry instanceof Scope ? // It may be a scope
                entry.lookup('default') :  // Lookup in parent
                [entry, this]; // Return current
        }

        return null;
    }

    /**
     * Adds a new member to this scopes and verifies that there are no duplicates
     * @param name
     * @param value
     */
    private setMember(name: string, value: Scope | Declaration): void {
        if (this.members.has(name)) {
            throw new Error(`The type named "${name}" is already declared.`);
        }

        this.members.set(name, value);
    }

    /**
     * Returns the declaration itself if its a group and new scope
     * in case of a block
     * @param dec
     */
    private resolveValueFor(dec: Declaration): Declaration | Scope {

        // Create sub-scope if it's a block
        if (dec.value.type === 'block') {
            const scope = new Scope({parent: this});
            scope.registerAll(dec.value.value);
            return scope;
        }

        return dec;
    }

    /**
     * Looks up a member by name
     * @param name
     */
    private lookupByName(name: string): Declaration | Scope | null {

        // Lookup type in current scope
        if (this.members.has(name)) {
            return this.members.get(name) as (Declaration | Scope);
        }

        // Lookup parent scope
        return this.parent ? this.parent.lookupByName(name) : null;
    }

    /**
     * Resolves a deep reference relative to the current path
     * @param path
     */
    private lookupDeepReference(path: Array<string>): [Declaration, Scope] | null {
        const member = path.length ? this.exports.get(path.shift() as string) : null;

        if (!member) {
            return path.length ? null : this.lookup('default');
        }

        if (member instanceof Scope) {
            return member.lookupDeepReference(path);
        } else if (!path.length) {
            return [member, this];
        }

        return null;
    }
}
