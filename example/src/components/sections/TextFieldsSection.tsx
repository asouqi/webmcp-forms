import { FormValues } from '../../shared/types';
import { Section, SectionTitle, FormGroup, Label, Input } from '../../shared/styles';

interface TextFieldsSectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function TextFieldsSection({ values, onChange }: TextFieldsSectionProps) {
    return (
        <Section>
            <SectionTitle>📝 Text Fields (with validation)</SectionTitle>

            <FormGroup>
                <Label>Full Name * (required, 2-50 chars)</Label>
                <Input
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label>Email * (required, must be valid email)</Label>
                <Input
                    type="email"
                    value={values.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label>Bio (optional, max 200 chars)</Label>
                <Input
                    value={values.bio}
                    onChange={(e) => onChange('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                />
                <small style={{ color: '#666', fontSize: '11px' }}>
                    {values.bio.length} / 200 characters
                </small>
            </FormGroup>
        </Section>
    );
}