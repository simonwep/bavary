
### Entry type
Each parser consists of exactly **one** `entry` type followed by a named or anonymous [type declaration](#type-definition):
```html
// Named entry type
entry <my-first-type> = ['A']

// Or use an anonymous entry type
entry ['A']
```


### Characters
Everything is build upon matching different types of single characters / ranges:

| Name | Description | Example |
| ---- | ----------- | ------- |
| Single Character  | Matches exactly the given character | `'A'` |
| Character range | Matches every character between two anchor-chars | `'a' to 'z'` | 
| UTF-8 Range | Matches every character between two utf8 character-codes | `\uxxxx to \uxxxx` where `x` must be a valid hexa-decimal value |


### Multipliers
Groups generally (and types used _in_ groups) can have multipliers to define how often the given sequence should occur:

| Sign | Name | Description | Examples |
| ---- | ---- | ----------- | -------- |
| | No multiplier | The group / type occurs exactly **one time** | `['A']` `<abc>` |
| `+` | Plus-sign | **One** or **more times** | `['A']+` `<abc>+` |
| `*` | Asterisk | **Zero** or **more times** | `['A']*` `<abc>*` |
| `{min, max}`| Curly braces | **min** up to **max** times (both inclusive) | `['A']{3,6}` `<abc>{3,6}` |
| `?` | Question mark | **One** or **zero** time (optional) | `['A']?` `<abc>?` |


### Combinators
Combinators define how components in a group should be treated:

| Sign | Name | Description | Example |
| ---- | ---- | ----------- | ------- |
| | Juxtaposition | Each component is mandatory and must appear in the given order | `'A' <abc>` |
| `\|` | Single bar | Exactly one of the components must match | `'A' \| 'B'` |
| `&` | Ampersand | Each component is mandatory but the may appear in any order | `'A' & 'B'` |

Combinators don't have any priorities, mixed combinators will be grouped from left to right. Use [groups](#group-definitions) to 
bypass precedence rules.

> More coming soon!


### Group definitions
Groups can be used to group related items together or to bypass precedence rules.
Each group can additionally contain references to other types, groups or single characters:
```html
<1-or-2> = ['1' | '2']
<a-b-c> = ['abc' <1-or-2>]
entry [<a-b-c>]
```

Groups can always have [multipliers](#multipliers) appended to it:
```html
entry ['a' | 'b' | ['c' 'd']*]+
```


### Type definition
A type is a re-usable form of a group which can be used in other declarations, it's even possible to create recursive parser with it!

Each type can either be a [parsing-group](#group-definitions), to **group related** types together, or a direct definition of a character / type sequence.
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


### Block definitions
Blocks (or scopes) can be used to **scope** [types](#type-definition) and **group** related [types](#type-definition) together without interfering other types.

Each block can have exactly one, optional `default` export which can be used to define the behaviour if you use it without referring to
sub-types, and an arbitrary amount of _exported_ types:

```html
<characters> = {

  // Exported types
  export <uppercase> =  ['A' to 'Z']
  export <lowercase> =  ['a' to 'z']
  export <numbers> = ['0' to '9']
  
  // Default export if <character> is used without referring to exported types.
  // The default will match either 'A' - 'Z', 'a' - 'z' or '0' - '9'
  default [<uppercase> | <lowercase> | <numbers>]
}

// Using <characters> without deep-selection will result in [<uppercase> | <lowercase> | <numbers>]
// To access nested e.g. the <uppercase> type use `<characters:uppercase>`
entry [<characters>+]
```
