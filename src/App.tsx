import { useState } from 'react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import dagre from '@dagrejs/dagre';
import { Background, ReactFlow, type Edge, type Node } from '@xyflow/react';
import {
  ObjectNode,
  ArrayNode,
  PrimitiveNode,
} from './components/NodeVisualizer';

const nodeTypes = {
  object: ObjectNode,
  array: ArrayNode,
  primitive: PrimitiveNode,
};

function App() {
  const [value, setValue] = useState<string>('');

  const [error, setError] = useState<any>('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  //   const sampleJsonValue = `{
  //   "user": {
  //     "name": "Rahul",
  //     "age": 28,
  //     "email": "Rahul@gamil.com"
  //   },
  //   "products": [
  //     {
  //       "id": 1,
  //       "name": "Laptop"Canvas rendering coming next...
  //     }
  //   ]
  // }`;

  const sampleJsonValue = `{
  "user": {
    "name": "Rahul",
    "age": 28
  }
}`;

  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 220;
  const nodeHeight = 60;

  function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
      return newNode;
    });

    return { nodes: newNodes, edges };
  }

  function convertJsonToNodeAndEdges(jsonValue: any) {
    const nodes: NodeType[] = [];
    const edges: EdgeType[] = [];
    let nodeIdCounter = 0;

    function convertJsonData(
      data: any,
      parentId: string | null,
      key: string,
      path: string,
      level: number
    ): string {
      const currentNodeId = `node-${nodeIdCounter++}`;

      console.log('path', path);
      console.log('parentId', parentId);

      const isArray = Array.isArray(data);
      const isObject = data !== null && typeof data === 'object' && !isArray;

      if (isObject) {
        nodes.push({
          id: currentNodeId,
          type: 'object',
          data: {
            label: key,
            path: path,
            nodeType: 'object',
          },
          position: { x: 0, y: 0 },
        });

        Object.keys(data).forEach((childKey) => {
          const childPath = `${path}.${childKey}`;
          const childNodeId = convertJsonData(
            data[childKey],
            currentNodeId,
            childKey,
            childPath,
            level + 1
          );

          edges.push({
            id: `edge-${currentNodeId}-${childNodeId}`,
            source: currentNodeId,
            target: childNodeId,
            label: childKey,
          });
        });

        console.log('isObject', key);
      } else if (isArray) {
        nodes.push({
          id: currentNodeId,
          type: 'array',
          data: {
            label: `${key}[]`,
            path: path,
            nodeType: 'array',
          },
          position: { x: 0, y: 0 },
        });

        data.forEach((element: any, index: number) => {
          const childPath = `${path}[${index}]`;
          const childNodeId = convertJsonData(
            element,
            currentNodeId,
            `[${index}]`,
            childPath,
            level + 1
          );
          edges.push({
            id: `edge-${currentNodeId}-${childNodeId}`,
            source: currentNodeId,
            target: childNodeId,
            label: `[${index}]`,
          });
        });
        console.log('isArray', key);
      } else {
        const nodeValue = typeof data === 'string' ? `"${data}"` : String(data);
        nodes.push({
          id: currentNodeId,
          type: 'primitive',
          data: {
            label: `${key}: ${nodeValue}`,
            path: path,
            nodeType: 'primitive',
          },
          position: { x: 0, y: 0 },
        });
        console.log('Primitive:', key, data);
      }
      return currentNodeId;
    }

    convertJsonData(jsonValue, null, 'root', '$', 0);

    const layouted = getLayoutedElements(nodes, edges, 'TB');

    return layouted;
  }

  function handleSubmit() {
    try {
      const parseValue = JSON.parse(value);
      console.log('parsed value', parseValue);
      const { nodes: newNodes, edges: newEdges } =
        convertJsonToNodeAndEdges(parseValue);

      console.log('newNodes', newNodes);
      console.log('newEdges', newEdges);
      setNodes(newNodes);
      setEdges(newEdges);
      setError('');
      // @ts-expect-error this error is expected
    } catch (err: { message: string }) {
      toast.error(err.message);
      console.log(error);
    }
  }
  // @ts-expect-error expecting this error
  function handleChange(e) {
    // console.log(e.target.value);
    setValue(e.target.value);
  }

  function loadSmapleJson() {
    setValue(sampleJsonValue);
    // console.log(sampleJsonValue);
  }
  return (
    <>
      <Toaster position="top-center" richColors />
      {/* <div className="flex"> */}
      <header className="bg-zinc-100 text-muted-foreground p-8 border">
        <h1 className="text-3xl mb-2 font-semibold">JSON Visualizer</h1>
      </header>
      <div className="w-full my-auto p-2 bg-muted-foreground h-auto flex flex-1 gap-2  ">
        <div className="bg-background p-8 mx-4 rounded-xl flex-none min-w-96 max-w-28">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Tree Structure
          </h2>
          <p className="text-gray-600 mb-4">
            Generated {nodes.length} nodes and {edges.length} edges
          </p>
          <Textarea
            className=" max-h-full w-full p-4 min-h-2/3 border-2 border-gray-300 rounded-lg font-mono mb-4"
            placeholder="Type your message here."
            value={value}
            onChange={handleChange}
          />
          <div className="flex flex-col-reverse gap-2">
            <Button
              onClick={handleSubmit}
              className="w-full text-muted-foreground bg-primary-foreground"
              variant="outline"
            >
              Generat Visuals
            </Button>
            <Button
              onClick={loadSmapleJson}
              className="w-full text-muted-foreground"
              variant="secondary"
            >
              Load sample
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 flex-1">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Tree Structure
          </h2>
          <p className="text-gray-600 mb-4">
            Generated {nodes.length} nodes and {edges.length} edges
          </p>

          <div className="h-[600px] border-2 border-gray-300 rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
            </ReactFlow>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default App;
