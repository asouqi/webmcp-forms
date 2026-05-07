import { FormValues } from '../../shared/types';
import { Section, SectionTitle, FormGroup, Label, Input } from '../../shared/styles';

interface ObjectSectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function ObjectSection({ values, onChange }: ObjectSectionProps) {
    return (
        <Section>
            <SectionTitle>🏠 Address (object, no validation)</SectionTitle>

            <FormGroup>
                <Label>Street</Label>
                <Input
                    value={values.address.street}
                    onChange={(e) =>
                        onChange('address', { ...values.address, street: e.target.value })
                    }
                />
            </FormGroup>

            <FormGroup>
                <Label>City</Label>
                <Input
                    value={values.address.city}
                    onChange={(e) =>
                        onChange('address', { ...values.address, city: e.target.value })
                    }
                />
            </FormGroup>

            <FormGroup>
                <Label>ZIP Code</Label>
                <Input
                    value={values.address.zip}
                    onChange={(e) =>
                        onChange('address', { ...values.address, zip: e.target.value })
                    }
                />
            </FormGroup>
        </Section>
    );
}