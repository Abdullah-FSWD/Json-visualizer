import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <>
      <div style={{ width: '60vw', height: '100vh' }}>
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView />
      </div>
    </>
  );
}

export default App;
