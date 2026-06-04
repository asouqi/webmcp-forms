// import React, { useState } from 'react'
// import styled from 'styled-components'
// import { CustomFormSchema } from './zodSchema'
// import { useTools } from "webmcp-adapter-react"
// import { defineTool } from "webmcp-adapter"
// import {CodeBlock, ExampleLabel, HelpTitle, InspectorHelp} from "./styled";
//
// const CreativeForm = () => {
//     const [formData, setFormData] = useState({
//         projectAsset: '',
//         brandColor: '#4A90E2',
//         difficultyLevel: 5,
//         tags: [],
//         extraMetadata: {
//             isPublic: true,
//             priority: 'medium'
//         },
//         appointmentDate: '',
//         projectFile: null //{ name: null, size: 0, type: null, content: null }
//     });
//
//     const handleChange = (path, value) => {
//         setFormData(prev => {
//             const newState = { ...prev };
//
//             // Handle nested updates for extraMetadata
//             if (path.includes('.')) {
//                 const [parent, child] = path.split('.');
//                 newState[parent] = { ...prev[parent], [child]: value };
//             } else {
//                 newState[path] = value;
//             }
//
//             return newState;
//         });
//     };
//
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//
//         // Convert file to Base64 for state/AI consistency
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setFormData(prev => {
//                 const newState = { ...prev };
//                 newState.projectFile = {
//                     name: file.name,
//                     size: file.size,
//                     type: file.type,
//                     content: reader.result
//                 } as any
//                 return newState
//             });
//         };
//         reader.readAsDataURL(file);
//     };
//
//     useTools({
//         tools: [
//             defineTool({
//                 name: 'create_custom_project',
//                 description: "Creates a project with color branding, tags, and file attachments.",
//                 inputSchema: CustomFormSchema.toJSONSchema(),
//                 validator: CustomFormSchema as any,
//                 execute: async (data) => {
//                     const fieldsObj = {...data}
//                     setFormData(fieldsObj as any)
//                     return {
//                         content: [{ type: "text", text: 'updated custom project' }],
//                         structuredContent: {
//                             success: true,
//                         }
//                     }
//
//                 }
//             })
//         ]
//     })
//
//     return (
//         <FormContainer
//             data-webmcp-tool="manage_project"
//             data-webmcp-description="Update project details, colors, and difficulty levels."
//         >
//             <FormGroup>
//                 <Label>Asset URL</Label>
//                 <Input
//                     type="text"
//                     value={formData.projectAsset}
//                     onChange={(e) => handleChange('projectAsset', e.target.value)}
//                     placeholder="https://..."
//                 />
//             </FormGroup>
//
//             <FormGroup>
//                 <Label>Brand Color</Label>
//                 <ColorRow>
//                     <input
//                         type="color"
//                         value={formData.brandColor}
//                         onChange={(e) => handleChange('brandColor', e.target.value)}
//                     />
//                     <Input
//                         type="text"
//                         value={formData.brandColor}
//                         onChange={(e) => handleChange('brandColor', e.target.value)}
//                     />
//                 </ColorRow>
//             </FormGroup>
//
//             <FormGroup>
//                 <Label>Difficulty: {formData.difficultyLevel}</Label>
//                 <input
//                     type="range" min="1" max="10"
//                     value={formData.difficultyLevel}
//                     onChange={(e) => handleChange('difficultyLevel', parseInt(e.target.value))}
//                 />
//             </FormGroup>
//
//             <FormGroup>
//                 <Label>Tags (Comma separated)</Label>
//                 <Input
//                     type="text"
//                     value={formData.tags.join(', ')}
//                     onChange={(e) => handleChange('tags', e.target.value.split(',').map(s => s.trim()))}
//                 />
//                 <TagList>
//                     {formData.tags.map((tag, i) => tag && <Tag key={i}>{tag}</Tag>)}
//                 </TagList>
//             </FormGroup>
//
//             <FormGroup>
//                 <Label>Priority</Label>
//                 <Select
//                     value={formData.extraMetadata.priority}
//                     onChange={(e) => handleChange('extraMetadata.priority', e.target.value)}
//                 >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                 </Select>
//             </FormGroup>
//
//             {/* Date Input */}
//             <Field>
//                 <Label>Select Date (2026 Only)</Label>
//                 <Input
//                     type="date"
//                     value={formData.appointmentDate}
//                     min="2026-01-01"
//                     max="2026-12-31"
//                     onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
//                 />
//             </Field>
//
//             {/* File Input */}
//             <Field>
//                 <Label>Upload Asset (Max 5MB)</Label>
//                 <Input type="file" onChange={handleFileChange} accept="image/*" />
//
//                 {formData.projectFile && (
//                     <FilePreview>
//                         <img src={formData.projectFile.content} alt="Preview" />
//                         <p>{formData.projectFile.name} ({(formData.projectFile.size / 1024 / 1024).toFixed(2)} MB)</p>
//                     </FilePreview>
//                 )}
//             </Field>
//
//             <InspectorHelp>
//                 <HelpTitle>🧪 WebMCP Inspector - Test Validation</HelpTitle>
//
//                 <p style={{ fontSize: '13px', margin: '0 0 8px 0' }}>
//                     Tool name: <code>create_custom_project</code>
//                 </p>
//
//                 <ExampleLabel>✅ Valid: project</ExampleLabel>
//                 <CodeBlock>
//                     {`  {
//  "projectAsset": "http://localhost:5174/",
//  "brandColor": "#fff",
//  "difficultyLevel": 4,
//  "tags": [
//   "example_string"
//  ],
//  "extraMetadata": {
//   "isPublic": true,
//   "priority": "low"
//  },
//  "appointmentDate": "2026-05-10",
// "projectFile": {
//     "name": "brand-logo.png",
//     "size": 1024,
//     "type": "image/png",
//     "content": "data:image/jpeg;base64,/9j/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAlAEADASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAEDBAUG/8QAJhAAAgICAgEDBAMAAAAAAAAAAAECAwQRITESBVGRIjNBgVJhsf/EABcBAAMBAAAAAAAAAAAAAAAAAAABAwL/xAAcEQACAgMBAQAAAAAAAAAAAAAAARESAgMxQSH/2gAMAwEAAhEDEQA/APPEGrFjTGyLv6e+y3Itx3b5KEXtL+v8L1n6RtHwwEmrVNvCcf09NfJFuFdBvxi5R/DHVitJmA0/Zjxk+k/gxY3UA1y9MyI4yuai134p8mMJa6ELwltvl8kAgm2bSJLa8mypajN69ioAsmuA0n06FefW/uVQUv5qPJsxJYc/LcoOXemnrXucPa9kX4llcMiLs3Bb5kudforjs8ZLLX6j01VEYY0vqcl2m+zyt6SyLFHryevk7Gb6nVCtwxrPPa41+Dib5DZkuD1pwQACBUAABgAAIkgAYH//2Q=="
//   }
// }`}
//                 </CodeBlock>
//
//                 <ExampleLabel>❌ Invalid: date</ExampleLabel>
//                 <CodeBlock>
//                     {`  {
//  "projectAsset": "http://localhost:5174/",
//  "brandColor": "#fff",
//  "difficultyLevel": 4,
//  "tags": [
//   "example_string"
//  ],
//  "extraMetadata": {
//   "isPublic": true,
//   "priority": "low"
//  },
//  "appointmentDate": "2022-05-10",
// "projectFile": {
//     "name": "brand-logo.png",
//     "size": 1024,
//     "type": "image/png",
//     "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
//   }
// }`}
//                 </CodeBlock>
//             </InspectorHelp>
//         </FormContainer>
//     );
// };
//
// // --- Styled Components ---
// const FormContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   padding: 20px;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//   max-width: 450px;
// `;
//
// const FilePreview = styled.div`
//   margin-top: 10px;
//   padding: 10px;
//   background: #f8f9fa;
//   border-radius: 8px;
//   img { max-width: 100px; border-radius: 4px; margin-bottom: 5px; }
//   p { font-size: 12px; color: #666; margin: 0; }
// `;
//
// const FormGroup = styled.div` display: flex; flex-direction: column; gap: 5px; `;
// const Label = styled.label` font-size: 14px; font-weight: bold; `;
// const Input = styled.input` padding: 8px; border: 1px solid #ccc; border-radius: 4px; `;
// const Select = styled.select` padding: 8px; border: 1px solid #ccc; border-radius: 4px; `;
// const ColorRow = styled.div` display: flex; gap: 10px; input[type="color"] { width: 40px; height: 40px; border: none; } `;
// const TagList = styled.div` display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap; `;
// const Tag = styled.span` background: #eee; padding: 2px 8px; border-radius: 10px; font-size: 12px; `;
// const Field = styled.div` display: flex; flex-direction: column; gap: 8px; `;
//
// export default CreativeForm;