> Before you start, you can also checkout [examples](examples) directly!

#### Content
1. [Entry type](#entry-type) _- Each parser starts with it._
2. [Character Selection](#character-selection) _- Core concept._
3. [Groups](#group-definition) _- Group related items._
4. [Multipliers](#multipliers) _- How (and how often) should things get matched._
5. [Types](#type-definition) _- Give groups or [blocks](#block-definition) a name._
6. [Blocks](#block-definition) _- Scope [types](#type-definition) an things which are related to each other._
7. [Tags](#tags) _- Give used [types](#type-definition) a name._
8. [Operators](#operators) _- Specify how a result should be processed._  
   8.1. [Spread Operator](#spread-operator) _- Let the result of a [type](#type-definition) bubble up._  
   8.2. [Modifiers](#modifiers) _- Alter the result of a [type](#type-definition)._

### Entry type
Each parser consists of exactly **one** `entry` type followed by a named (or anonymous) [type declaration](#type-definition) **or**
a [block](#block-definition) definition where the default export will be used:
```html
// Named entry type
entry <my-first-type> = ['A']

// Or use an anonymous entry type
entry ['A']
```


### Character Selection
Everything is build upon matching different types of single characters / -ranges:

| Name | Description | Example |
| ---- | ----------- | ------- |
| Single Character | Matches exactly the given character | `'A'` |
| Character range | Matches every character between two anchor-chars | `(a - z)` |
| Character range with excludet characters | Excludes a char-range or single character | `(a - z except g, h)`  |
| UTF-8 Range | Matches every character between two utf8 character-codes | `(\uxxxx - \uxxxx)` where `x` must be a valid hexadecimal value |

Attention: all **punctuation characters** (such as `"`, `,` , `-`...) need to be escaped (`\\,`) or quoted (`","`)!

Character selection could also have [multipliers](#multipliers) attached to it, for example `(a - z, except d - g, z){4, 7}`: Matches all characters **between `a` and `z`** except the range `d` to `g` and the character `z`
4 to 7 times.

**All punctuation characters** need to be escaped: `(\- - \+)` (`-` to `+`) / `(\\\n - \t)` (`\n` to `\t`, line-breaks need to be escaped too)


### Group definition
Groups can be used to group related items together or to bypass precedence rules.
Each group can additionally contain containers to other types, groups or single characters:
```html
<1-or-2> = ['1' | '2']
<a-b-c> = ['abc' <1-or-2>
entry [<a-b-c>]
```

Groups can always have [multipliers](#multipliers) appended to it:
```html
entry ['a' | 'b' | ['c' 'd']*]+
```


### Multipliers
Groups generally (and types used _in_ groups) can have multipliers to define how often the given sequence should occur:

| Sign | Name | Description | Examples |
| ---- | ---- | ----------- | -------- |
| | No multiplier | The group / type occurs exactly **one time** | `['A']` `<abc>` |
| `+` | Plus-sign | **One** or **more times** | `['A']+` `<abc>+` |
| `*` | Asterisk | **Zero** or **more times** | `['A']*` `<abc>*` |
| `{min, [max]}`| Curly braces | **min** up to **max** times (both inclusive) | `['A']{3,6}` `<abc>{3,}` (Empty means infinity, only works at the end) |
| `?` | Question mark | **One** or **zero** time (optional) | `['A']?` `<abc>?` |

Each multiplier will result in different kind of results.

* `*` Will **always** result in an array since it matches _zero_ or more times.
* `+` or `{min, max}` Could **either** return an **array** or **`undefined`** since it's required to match _at least_ one time.
* `?` Is **either** the result or **`undefined`**.

The outcome will affect the value of [tags](#tags)


### Combinators
Combinators define how components in a group should be treated:

| Sign | Name | Description | Example |
| ---- | ---- | ----------- | ------- |
| | Juxtaposition | Each component is mandatory and must appear in the given order | `'A' <abc>` |
| `\|` | Single bar | Exactly one of the components must match | `'A' \| 'B'` |
| `&` | Ampersand | Each component is mandatory but the may appear in any order | `'A' & 'B'` |
| `&&` | Double ampersand | At least one component must be present, and the may appear in any order | `'A' && 'B'` |

Combinators don't have any priorities, mixed combinators will be grouped from left to right. Use [groups](#group-definition) to
bypass precedence rules.


### Type definition
A type is a re-usable form of a group which can be used in other declarations, it's even possible to create recursive parser with it!

Each type can either be a [parsing-group](#group-definition), to **group related** types together, or a direct definition of a character / type sequence.
```html
// Group definition
<my-group-type> = ['A']

// Block / Scope definition
<my-block-type> = {...}
```

Types used in declarations can be [multiplied](#multipliers):
```html
entry [<my-type>+]
```


### Block definition
Blocks (or scopes) can be used to **scope** [types](#type-definition) and **group** related [types](#type-definition) together without interfering other types.

Each block can have exactly one, optional `default` export which can be used to define the behaviour if you use it without referring to
sub-types, and an arbitrary amount of _exported_ types:

```html
<characters> = {

  // Exported types
  export <uppercase> = [(A - Z)]
  export <lowercase> = [(a - z)]
  export <numbers> = [(0 - 9)]

  // Default export if <character> is used without referring to exported types.
  // The default will match either 'A' to 'Z', 'a' to 'z' or '0' to '9'
  default [<uppercase> | <lowercase> | <numbers>]
}

// Using <characters> without deep-selection will result in [<uppercase> | <lowercase> | <numbers>]
// To access nested e.g. the <uppercase> type use `<characters:uppercase>`
entry [<characters>+]
```


### Tags
So far you would only get a string, (nested-) array of strings or `null` if nothing got matched.
Tags can be used to get actual objects:

```html
entry {
    <number> = [(0 - 9)] // All characters from '0' to '9'
    <sign> = ['-' | '+'] // '-' or '+'

    default [
        <sign#prefix>
        <number#num>
    ]
}
```

The result of using '+5' would be:
```
{
   prefix: '+',
   num: '5'
}
```

Without tags it would just return `+5` as plain-string.


### Operators
Operators can be used to specify how the result of a type should be handles.

#### Spread operator
The spread-operator (`...`) can be prepend on a type to join (or consume) it's result:

```js
const parse = compile(`
    <char> = {
        <uppercase> = [(A - Z)+]
        <lowercase> = [(a - z)+]

        // This returns {up: string | null, low: string | null}
        default [
            [<uppercase#up> <lowercase#low>]
        ]
    }

    <num> = [(0 - 9)+]

    entry {
        default [...<char> <num#num>]
    }
`);

console.log(parse('ABCabc123'));
```

The code above would log the following:
```json
{
    "up": "ABC",
    "low": "abc",
    "num": "123"
}
```

As we can see `up` and `low` bubbled up in their hierarchy and are now assigned to the root result.
If there wouldn't be a spread operator and `<char>` would be tagged with `char` it'd print the following:

```json
{
    "char": {
        "up": "ABC",
        "low": "abc"
    },
    "num": "123"
}
```

#### Modifiers
Modifiers can be used to alter the result of a [type](#type-definition) or [group](#group-definition)
and must at least contain **one definition**.

> The target **must** return an object.

```js
const parse = compile(`

    // <char> returns an object since tags are used within it
    <char> = {
        <uppercase> = [(A - Z)]+

        default [
            [<uppercase#up>]
        ]
    }

    entry {
        default [
            <char#ch{
                def firstProp = 'Value A',
                def second = up[0]
            }>
        ]
    }
`);

console.log(parse('ABC'));
```

The code above would log the following:
```
{
    "ch": {
        "up": [
            "A",
            "B",
            "C"
        ],
        "firstProp": "Value A", // Custom prop
        "second": "A" // First item of 'up'
    }
}
```

Each kw-pair must be seperated with commas, the name must be a valid identifier and the value always a string.

##### Available modifiers:

| Modifier | Explanation | Example |
| -------- | ----------- | ------- |
| def | Add custom values to a result or select a specific value | `def key = 'wow'` `def sub = obj.arr[2].v` |
| del | Remove a property (can be a nested one) from the result-set | `del key` `del baz.bam[2].foo` |

> They can be used in combination with the spread operator!
