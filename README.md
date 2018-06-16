# Sanctuary Sandbox

## Examples

### Maybe

```js
const { Just, fromMaybe } = S

// Converts a Maybe to a value and provides a default for Nothing
fromMaybe(0)(Just(42)) // => 42
```

### Either

```js
const { compose, chain, either, Left, Right } = S

const request = {
  query: { uid: 'I AM UID' },
  body: { address: 'I AM ADDRESS' }
}

// hasUid :: HttpRequest -> Either
const hasUid = (req) =>
  req.query.uid ? Right(req) : Left({ code: 418, msg: 'Missing UID' })

// hasAddress :: HttpRequest -> Either
const hasAddress = (req) =>
  req.body.address ? Right(req) : Left({ code: 418, msg: 'Missing Address' })

// validate :: HttpRequest -> Either
const validate = (req) => chain(hasAddress)(hasUid(req))

// validatePass :: HttpRequest -> String
const validatePass = (req) => req.query.uid

// validateFail :: Error -> String
const validateFail = (err) => err.msg

// fold :: Either -> String
const fold = (reqEither) => either(validateFail)(validatePass)(reqEither)

compose(fold)(validate)(request) // => I AM UID
```
