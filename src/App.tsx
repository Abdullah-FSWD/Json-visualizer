import { useState } from 'react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import dagre from '@dagrejs/dagre';

type NodeType = {
  id: string;
  type: 'object' | 'array' | 'primitive';
  label: string;
  path: string;
  x: number;
  y: number;
};

type EdgeType = {
  id: string;
  source: string;
  target: string;
  label: string;
};

function App() {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<any>('');
  const [nodes, setNodes] = useState<NodeTypes[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);

  //   const sampleJsonValue = `{
  //   "user": {
  //     "name": "Rahul",
  //     "age": 28,
  //     "email": "Rahul@gamil.com"
  //   },
  //   "products": [
  //     {
  //       "id": 1,
  //       "name": "Laptop"
  //     }
  //   ]
  // }`;

  const sampleJsonValue = `{
  "user": {
    "name": "Rahul",
    "age": 28
  }
}`;

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

      const isArray = Array.isArray(data);
      const isObject = data !== null && typeof data === 'object' && !isArray;

      if (isObject) {
        nodes.push({
          id: currentNodeId,
          type: 'object',
          label: key,
          path: path,
          x: 0,
          y: 0,
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
          label: `${key}[]`,
          path: path,
          x: 0,
          y: 0,
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
          label: `${key}: ${nodeValue}`,
          path: path,
          x: 0,
          y: 0,
        });
        console.log('Primitive:', key, data);
      }
      return currentNodeId;
    }

    convertJsonData(jsonValue, null, 'root', '$', 0);

    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(
      () => ({})
    );

    const nodeWidth = 172;
    const nodeHeight = 36;

    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.x = nodeWithPosition.x;
      node.y = nodeWithPosition.y;
    });

    return { nodes, edges };
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
    } catch (err: { message: string }) {
      toast.error(err.message);
    }
  }

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
      <div className="bg-background ">
        <header className="bg-zinc-100 text-muted-foreground p-8 border">
          <h1 className="text-3xl mb-2 font-semibold">JSON Visualizer</h1>
        </header>
        <div className=" my-auto mx-0 p-2 bg-muted-foreground h-auto flex flex-1 gap-2 ">
          <div className="bg-background p-8 rounded-xl flex-none min-w-96 max-w-28">
            <Textarea
              className="min-h-64 max-h-full w-full p-4 border-2 border-gray-300 rounded-lg font-mono mb-4"
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
          <div className="flex-1 bg-background p-8 rounded"></div>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default App;
