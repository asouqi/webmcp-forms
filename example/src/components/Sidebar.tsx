import { Framework } from '../shared/types';
import {
    SidebarContainer,
    SidebarTitle,
    SidebarButton,
    Badge,
    ComingSoonBadge,
} from '../shared/styles';

interface SidebarProps {
    selected: Framework;
    onChange: (framework: Framework) => void;
}

export function Sidebar({ selected, onChange }: SidebarProps) {
    return (
        <SidebarContainer>
            <SidebarTitle>Examples</SidebarTitle>

            <SidebarButton
                $active={selected === 'core'}
                onClick={() => onChange('core')}
            >
                Core API
            </SidebarButton>

            <SidebarButton
                $active={selected === 'react'}
                onClick={() => onChange('react')}
            >
                React Hook
                <Badge>Current</Badge>
            </SidebarButton>

            <SidebarButton
                $active={selected === 'formik'}
                onClick={() => onChange('formik')}
            >
                Formik
                <ComingSoonBadge>Soon</ComingSoonBadge>
            </SidebarButton>
        </SidebarContainer>
    );
}