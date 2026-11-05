# Restricted Source Map

The source baseline is the TEST1 static review snapshot `0505e614` on `fa3de7cb`. This baseline cannot be used to sign off any later runtime.

| File in this package | Source / change |
| --- | --- |
| `lib/read-bounded-public.mjs` | Separated from `apps/client/src/observer/lookdev/assembly-projection.mjs`: kept `FRAME_CAP`, the local `check`, and `readBoundedPublic`, with their original text and limits. No shape or generation imports were carried over. |
| `tests/public-reader.test.mjs` | Kept the original assertion from `assembly-projection.test.mjs` in the same directory — `bounded streaming enforces bytes before parse and cancels excessive bodies including UTF-8` — with only the relative import changed. |
| `observer-target.mjs` | Read-only delivery adapter. The renderer is fixed to port 5219 and the observer to port 8844. The public frame is only used for a temporary availability check, not for world verification. |
| `server.mjs`, `index.html`, `app.mjs`, `style.css` | The current viewing entry point. No alternative scenes and no resident control. |
| `tests/observer-entry.test.mjs` | Package boundary tests. No real model and no original world data are used. |

The full `shared-test-observer.mjs` has SHA-256 `be3820023cef46dacd243896706f1bc4365f5afb130f6845183f1860a76966d7`, but it is not included in this package. The `construction.mjs` it references (SHA-256 `5d9425e99f22d8a0b8cd71419e81868c569b7e03c99121cb9c0ad8ba3d1ee16f`) references generation-related sources in turn, so it is excluded under the confidentiality limit. A rewritten copy is not presented as the original complete validator.

This map contains only relative program paths and source hashes. It contains no private machine paths and no execution data. The complete application is not in this restricted package, and the overall verdict remains PARTIAL.

A check against the handover confirmed that the public client module with the same name matches the hash of this review source. That only confirms the contents of that module. It does not mean the complete runtime is fixed, and it does not mean a real model result has been accepted.
