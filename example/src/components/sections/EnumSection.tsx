import { FormValues } from '../../shared/types';
import { COUNTRY_OPTIONS } from '../../shared/formConfig';
import { Section, SectionTitle, FormGroup, Label, Select } from '../../shared/styles';

interface EnumSectionProps {
    values: FormValues;
    onChange: (field: keyof FormValues, value: any) => void;
}

export function EnumSection({ values, onChange }: EnumSectionProps) {
    return (
        <Section>
            <SectionTitle>🌍 Country * (required, enum options)</SectionTitle>

            <FormGroup>
                <Label>Country</Label>
                <Select
                    value={values.country}
                    onChange={(e) => onChange('country', e.target.value)}
                >
                    {COUNTRY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                            {c || 'Select...'}
                        </option>
                    ))}
                </Select>
            </FormGroup>
        </Section>
    );
}