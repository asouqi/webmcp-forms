import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
  display: flex;
  gap: 20px;
`;

export const MainContent = styled.div`
  flex: 1;
  max-width: 900px;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const Section = styled.section`
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  margin: 0 0 12px 0;
  color: #333;
`;

export const FormGroup = styled.div`
  margin-bottom: 12px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const Checkbox = styled.input`
  margin-right: 8px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

export const Debug = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  max-height: 300px;
`;

export const InspectorBox = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #e8f4ff;
  border-radius: 8px;
  border: 1px solid #b8daff;
`;

export const HelpTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #004085;
`;

export const CodeBlock = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  margin: 8px 0;
`;

export const ExampleLabel = styled.span`
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 12px;
  margin-bottom: 4px;
`;

export const ValidationNote = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #856404;
`;

export const ValidationRule = styled.li`
  margin-bottom: 4px;
  font-size: 12px;
`;

export const SidebarContainer = styled.aside`
  width: 200px;
  position: sticky;
  top: 20px;
  height: fit-content;
`;

export const SidebarTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`;

export const SidebarButton = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: ${(props) => (props['active'] ? '#0366d6' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: 1px solid ${(props) => (props.active ? '#0366d6' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${(props) => (props.active ? '#0366d6' : '#f6f8fa')};
    border-color: #0366d6;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin-left: 8px;
  background: #28a745;
  color: white;
  font-size: 10px;
  border-radius: 3px;
  font-weight: 600;
`;

export const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin-left: 8px;
  background: #ffc107;
  color: #333;
  font-size: 10px;
  border-radius: 3px;
  font-weight: 600;
`;