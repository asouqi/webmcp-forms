import { useState } from 'react';
import { Framework } from './shared/types';
import { Container } from './shared/styles';
import { Sidebar } from './components/Sidebar';
import { CoreExample } from './components/framework/Core';
import { ReactExample } from './components/framework/React';
import { FormikExample } from './components/framework/Formik';

export default function App() {
    const [framework, setFramework] = useState<Framework>('react');

    return (
        <Container>
            <Sidebar selected={framework} onChange={setFramework} />

            {framework === 'core' && <CoreExample />}
            {framework === 'react' && <ReactExample />}
            {framework === 'formik' && <FormikExample />}
        </Container>
    );
}