### TODO::
- [x] create  `validate_{formId}_form`
- [x] create  `fill_{formId}_multiple_fields`
- [x] create  `clear_{formId}_field`
- [x] type improvement FormState`unknown`
- [ ] create monorepo
- [ ] add support to formik
- [ ] update README



#### 🔴 Must-Have (High Priority)
* `validate_{formId}_form`: Validate all fields and return errors without submitting. Users need to check validity before submission.
* `fill_{formId}_multiple_fields`: Fill multiple fields in one call. Currently AI must call fill_field N times for N fields — inefficient and slow.
* `clear_{formId}_field`: Clear a single field (set to empty/default). Currently requires knowing the "empty" value for each type.


#### 🟡 Should-Have (Medium Priority)
* `get_{formId}_errors`	Get current validation errors for all fields
* `get_{formId}_field_info`	Get field metadata (type, options, constraints) — helps AI understand what values are valid
* `set_{formId}_field_touched`	Mark field as touched (for showing validation on blur)


Current Core Status
Component	Status	Notes
createFormTools()	✅ Ready	Framework-agnostic, takes config + state
FormConfig	✅ Ready	Defines form structure
FormState interface	✅ Ready	Abstract state contract
fill_field tool	✅ Ready
get_form_state tool	✅ Ready
get_field_value tool	✅ Ready
submit_form tool	✅ Ready
reset_form tool	✅ Ready
validate_form tool	❌ Missing	Need to add
React useFormTools	✅ Ready	Basic React integration


Framework Support Analysis
What Each Framework Needs
Framework	Adapter Type	Complexity
Vanilla React (useState)	✅ Already have useFormTools	Low
Formik	Hook wrapper	Low
React Hook Form	Hook wrapper	Low
Vue (ref/reactive)	Composable	Low
Svelte	Store adapter	Low
Solid.js	Signal adapter	Low
Angular Reactive Forms	Service/Directive	Medium


src/
├── core/                    # Framework-agnostic core (existing)
│   ├── index.ts
│   ├── createFormTools.ts
│   ├── types.ts
│   └── tools/
│       ├── fillField.ts
│       ├── getFormState.ts
│       ├── getFieldValue.ts
│       ├── validateForm.ts   # Add this
│       ├── submitForm.ts
│       └── resetForm.ts
├── react/                   # Vanilla React (existing)
│   ├── index.ts
│   └── useFormTools.ts
├── formik/                  # New
│   ├── index.ts
│   └── useFormikTools.ts
├── react-hook-form/         # New
│   ├── index.ts
│   └── useRHFTools.ts
├── vue/                     # Future
│   ├── index.ts
│   └── useFormTools.ts
└── index.ts                 # Main entry