import { FormValues } from '../../shared/types';
import { Section, SectionTitle, FormGroup, Checkbox, CheckboxLabel } from '../../shared/styles';

interface BooleanSectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function BooleanSection({ values, onChange }: BooleanSectionProps) {
    return (
        <Section>
            <SectionTitle>☑️ Newsletter (boolean)</SectionTitle>

            <FormGroup>
                <CheckboxLabel>
                    <Checkbox
                        type="checkbox"
                        checked={values.subscribe}
                        onChange={(e) => onChange('subscribe', e.target.checked)}
                    />
                    Subscribe to newsletter
                </CheckboxLabel>
            </FormGroup>
        </Section>
    );
}