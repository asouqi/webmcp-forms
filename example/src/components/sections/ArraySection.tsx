import { FormValues } from '../../shared/types';
import { INTEREST_OPTIONS } from '../../shared/formConfig';
import { Section, SectionTitle, FormGroup, Checkbox, CheckboxLabel } from '../../shared/styles';

interface ArraySectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function ArraySection({ values, onChange }: ArraySectionProps) {
    return (
        <Section>
            <SectionTitle>🎯 Interests (array, 1-5 items)</SectionTitle>

            <FormGroup>
                {INTEREST_OPTIONS.map((interest) => (
                    <CheckboxLabel key={interest}>
                        <Checkbox
                            type="checkbox"
                            checked={values.interests.includes(interest)}
                            onChange={(e) => {
                                const newInterests = e.target.checked
                                    ? [...values.interests, interest]
                                    : values.interests.filter((i) => i !== interest);
                                onChange('interests', newInterests);
                            }}
                        />
                        {interest}
                    </CheckboxLabel>
                ))}
                <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '8px' }}>
                    Selected: {values.interests.length} (must be 1-5)
                </small>
            </FormGroup>
        </Section>
    );
}