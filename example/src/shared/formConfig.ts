import { FormField } from 'webmcp-forms';

// Form fields configuration with validation
export const fields: Record<string, FormField> = {
    // String with minLength, maxLength, and required
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2,
        maxLength: 50
    },

    // String with pattern validation (email regex)
    email: {
        type: 'string',
        label: 'Email',
        required: true,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    },

    // Number with min and max validation
    age: {
        type: 'number',
        label: 'Age',
        required: true,
        min: 18,
        max: 120
    },

    // Boolean field (no validation needed)
    subscribe: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    },

    // String with enum options (select)
    country: {
        type: 'string',
        label: 'Country',
        required: true,
        options: ['US', 'UK', 'CA', 'DE', 'FR']
    },

    // Array with minItems and maxItems validation
    interests: {
        type: 'array',
        label: 'Interests',
        minItems: 1,
        maxItems: 5
    },

    // String with just maxLength (optional field)
    bio: {
        type: 'string',
        label: 'Bio',
        maxLength: 200,
        placeholder: 'Tell us about yourself'
    },

    // Number with just min validation
    salary: {
        type: 'number',
        label: 'Expected Salary',
        min: 0
    },

    // Nested object field (no specific validation)
    address: {
        type: 'object',
        label: 'Address'
    },
};

// Initial form state
export const initialState = {
    name: '',
    email: '',
    age: 0,
    subscribe: false,
    country: '',
    interests: [] as string[],
    bio: '',
    salary: 0,
    address: {
        street: '',
        city: '',
        zip: '',
    },
};

// Options for select/checkbox fields
export const INTEREST_OPTIONS = [
    'Technology',
    'Sports',
    'Music',
    'Travel',
    'Food',
    'Gaming',
    'Reading'
];

export const COUNTRY_OPTIONS = ['', 'US', 'UK', 'CA', 'DE', 'FR'];

export const FORM_ID = 'registration';

export const VALIDATION_RULES = [
    '✅ Required fields (name, email, age, country)',
    '✅ String length constraints (name: 2-50 chars, bio: max 200)',
    '✅ Pattern matching (email regex validation)',
    '✅ Number ranges (age: 18-120, salary: min 0)',
    '✅ Enum options (country must be one of the list)',
    '✅ Array constraints (interests: 1-5 items)'
];