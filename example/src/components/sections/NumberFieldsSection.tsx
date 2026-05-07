import { FormValues } from '../../shared/types';
import { Section, SectionTitle, FormGroup, Label, Input } from '../../shared/styles';

interface NumberFieldsSectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function NumberFieldsSection({ values, onChange }: NumberFieldsSectionProps) {
    return (
        <Section>
            <SectionTitle>🔢 Number Fields (with validation)</SectionTitle>

            <FormGroup>
                <Label>Age * (required, 18-120)</Label>
                <Input
                    type="number"
                    value={values.age}
                    onChange={(e) => onChange('age', Number(e.target.value))}
                />
            </FormGroup>

            <FormGroup>
                <Label>Expected Salary (min: 0)</Label>
                <Input
                    type="number"
                    value={values.salary}
                    onChange={(e) => onChange('salary', Number(e.target.value))}
                />
            </FormGroup>
        </Section>
    );
}