# Sanctuary Sandbox

## How to

This app is a sandbox for playing with `Sanctuary`, `Daggy`, `Partial.Lense`, and `Ramda`

- Sanctuary import example: `const { compose, either } = S`
- Partial.Lenses import example: `const { prop, get, set } = L`
- Ramda import example: `const { pipe } = R`
- Daggy import example: `const { taggedSum } = daggy`

## Examples

### Sanctuary Maybe

```js
const { Just, fromMaybe } = S

// Converts a Maybe to a value and provides a default for Nothing
fromMaybe(0)(Just(42)) // => 42
```

### Sanctuary Either

```js
const { compose, chain, either, Left, Right } = S

const request = {
  query: { uid: 'I AM UID' },
  body: { address: 'I AM ADDRESS' }
}

// hasQuery :: HttpRequest -> Either
const hasQuery = (req) =>
  req.query ? Right(req) : Left({ code: 418, msg: 'Missing query' })

// hasBody :: HttpRequest -> Either
const hasBody = (req) =>
  req.body ? Right(req) : Left({ code: 418, msg: 'Missing body' })

// hasUid :: HttpRequest -> Either
const hasUid = (req) =>
  req.query.uid ? Right(req) : Left({ code: 418, msg: 'Missing UID' })

// hasAddress :: HttpRequest -> Either
const hasAddress = (req) =>
  req.body.address ? Right(req) : Left({ code: 418, msg: 'Missing Address' })

// chain1 :: HttpRequest -> Either
const chain1 = (req) => chain(hasQuery)(hasBody(req))

// chain2 :: Either -> Either
const chain2 = (prevEither) => chain(hasUid)(prevEither)

// chain3 :: Either -> Either
const chain3 = (prevEither) => chain(hasAddress)(prevEither)

// compose1 :: HttpRequest -> Either
const compose1 = (req) => compose(chain2)(chain1)(req)

// validate :: HttpRequest -> Either
const validate = (req) => compose(chain3)(compose1)(req)

// validatePass :: HttpRequest -> String
const validatePass = (req) => req.query.uid

// validateFail :: Error -> String
const validateFail = (err) => err.msg

// fold :: Either -> String
const fold = (reqEither) => either(validateFail)(validatePass)(reqEither)

compose(fold)(validate)(request) // => I AM UID
```
