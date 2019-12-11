import {Declaration, Group} from '../ast/types';

export class Scope {

    // Optional parent scope
    private readonly parent: Scope | null;

    // Exported members
    private readonly exports: Map<string, Declaration | Scope>;

    // Declared members (without any variant)
    private readonly members: Map<string, Declaration | Scope>;

    // If scope defines global scope, not everything is possible in there!
    private readonly global: boolean;

    // Default export
    private defaultExport: Declaration | Scope | null;

    // Entry
    private entry: Declaration | Scope | null;

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
        this.defaultExport = null;
        this.entry = null;
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
                if (this.entry) {
                    throw new Error('There can only be one entry.');
                } else if (!this.global) {
                    throw new Error('Only the global scope can contain entries.');
                }

                // It may be a named entry
                if (dec.name !== null) {
                    this.setMember(dec.name, resolved);
                }

                this.entry = resolved;
                break;
            }
            case 'default': {

                if (this.defaultExport) {
                    throw new Error('There can only be one default export.');
                } else if (this.global) {
                    throw new Error('The global scope can\'t have default exports.');
                }

                // It may be a named default export
                if (dec.name !== null) {
                    this.setMember(dec.name, resolved);
                }

                this.defaultExport = resolved;
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
    public lookupByName(name: string): Declaration | Scope | null {

        // Lookup type in current scope
        if (this.members.has(name)) {
            return this.members.get(name) as (Declaration | Scope);
        }

        // Lookup parent scope
        return this.parent ? this.parent.lookupByName(name) : null;
    }

    public lookupByPath(path: Array<string>): [Declaration, Scope] | null {
        const [cur, ...followUps] = path;
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

    public lookupDeepReference(path: Array<string>): [Declaration, Scope] | null {
        const member = path.length ? this.exports.get(path.shift() as string) : null;

        if (!member) {
            return path.length ? null : this.lookupDefault();
        }

        if (member instanceof Scope) {
            return member.lookupDeepReference(path);
        } else if (!path.length) {
            return [member, this];
        }

        return null;
    }

    /**
     * Returns the default-export
     */
    public lookupDefault(): [Declaration, Scope] | null {
        if (this.defaultExport) {
            return this.defaultExport instanceof Scope ?
                this.defaultExport.lookupDefault() :
                [this.defaultExport, this];
        }

        return null;
    }

    /**
     * Returns the entry value
     */
    public lookupEntry(): [Declaration, Scope] | null {
        if (this.entry) {
            return this.entry instanceof Scope ?
                this.entry.lookupDefault() :
                [this.entry, this];
        }

        return null;
    }
}
