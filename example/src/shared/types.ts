export interface FormValues {
    name: string;
    email: string;
    age: number;
    subscribe: boolean;
    country: string;
    interests: string[];
    bio: string;
    salary: number;
    address: {
        street: string;
        city: string;
        zip: string;
    };
}

export type Framework = 'core' | 'react' | 'formik';
