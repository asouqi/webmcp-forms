### TODO::
- [x] create  `validate_{formId}_form`
- [x] create  `fill_{formId}_multiple_fields`
- [x] create  `clear_{formId}_field`
- [x] type improvement FormState`unknown`
- [x] create monorepo
- [ ] add support to formik
- [x] update README



## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────────┐     ┌─────────────────────────┐  │
│   │  webmcp-forms   │     │  webmcp-adapter-react   │  │
│   │                 │     │                         │  │
│   │ createFormTools │────▶│  useTools()             │  │
│   │                 │     │                         │  │
│   └─────────────────┘     └───────────┬─────────────┘  │
│                                       │                 │
│                                       ▼                 │
│                           ┌─────────────────────────┐  │
│                           │    webmcp-adapter       │  │
│                           │                         │  │
│                           │    registerBatch()      │  │
│                           └───────────┬─────────────┘  │
│                                       │                 │
└───────────────────────────────────────┼─────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Browser WebMCP API    │
                            │  navigator.modelContext │
                            └─────────────────────────┘
```