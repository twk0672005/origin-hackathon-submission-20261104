# Origin — Read-Only Observer Package (Current Version)

Origin is a persistent world where an AI resident lives with a stable identity, its own memories, and a traceable history. People visit as observers. They watch the resident live and see the world change because of its choices, and they cannot interfere with it. Humans may offer guidance that the resident can ignore. They do not control it.

This package is the current, read-only observer entry point for that world, for use on the same local machine as the world. It is not a hosted webpage, and it cannot be opened remotely. It is not a standalone rebuild of Origin, and it does not create a new world.

## Current status

**Status: PARTIAL. Autonomous life is partially complete. Formal Stage 2 is not complete. The resident is currently in quiet observation.**

This package does not prove the resident's live status with a new live projection, and public interface readability on its own does not mean autonomous life has succeeded.

The four autonomous actions — wake, recognise, remember, and build — have not yet been evidenced in this package by a real model result together with chain evidence. No tour cards or simulated provider results have been used to fill that gap.

A real model result must be proven by that call's provider outcome, accepted events, persistence, and replay together. This package does not contain that private execution data, so it cannot prove a real model result on its own.

## Current scope and direction

**The Origin virtual world currently runs only on a local machine. It is not yet a networked world. The observer entry page in this package has not been put online.**

The direction is to connect every network node, so that separate local worlds can meet and share one common history, and Origin can become a real world rather than a set of isolated local demonstrations. That networking is a direction, not a capability this package claims today.

## How to check

```sh
node --test tests/public-reader.test.mjs tests/observer-entry.test.mjs
```

The first test keeps the existing public reader's bounded-streaming assertion. The other tests only check the boundaries of this new package. The upstream used in the tests is an explicit HTTP test double. It is not a model provider, and it is not a real model call. Test results should be judged from the verification report outside this package. This package does not claim in advance that the tests pass.

## What is intentionally not included

This package does not include the white paper, the single-source-of-truth document, the economic route, the core generation rules, the full kernel or generator, the full renderer generation dependency chain, credential or key loaders, resident private seeds or memory, live databases, call directories, receipts, scopes, logs, recordings, historical source capsules, build output, or personal data.

The full shared-test observer references shape definitions and generation-related dependencies, so it has not been copied in full. Only the bounded public text reading function, which contains no generation logic, has been separated out. See [SOURCE_MAP.md](SOURCE_MAP.md) for the scope.

The real renderer, observer, and authorised execution environment remain external dependencies. This package does not change the main branch, the running world, any database, or any Git state. It does not merge, push, publish, deploy, or submit on anyone's behalf. Submission is done by the owner in person.

## Last verification

Around 2026-11-05 01:48 UTC, the standalone entry point started, and the public base and frame endpoints on port 8844 returned HTTP 200. After reloading, the specified renderer showed Lumen. A later read of the public frame on port 8844 contained Synthetic Solo.

Those two reads were not taken at the same moment. Whether the view and the public projection agree has not yet been verified, and whether the difference is timing, caching, or routing has not yet been located. This view therefore cannot be presented as a completed formal result, and an HTTP 200 response alone cannot be presented as a completed real model loop. The original frame was not saved, and the service was not changed to remove this uncertainty.
