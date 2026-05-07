import { FormValues } from '../../shared/types';
import { Debug } from '../../shared/styles';

interface DebugPanelProps {
    values: FormValues;
}

export function DebugPanel({ values }: DebugPanelProps) {
    return (
        <Debug>
            <strong>Form State:</strong>
            {'\n'}
            {JSON.stringify(values, null, 2)}
        </Debug>
    );
}