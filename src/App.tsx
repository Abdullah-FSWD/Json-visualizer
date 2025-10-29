import { useState } from 'react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

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

  const sampleJsonValue = `{
  "user": {
    "name": "Alice",
    "age": 28,
    "email": "alice@example.com"
  },
  "products": [
    {
      "id": 1,
      "name": "Laptop"
    }
  ]
}`;

  function convertJsonToNodeAndEdges(jsonValue: any) {
    const nodes: NodeType[] = [];
    const edges: EdgeType[] = [];
    // TODO: write implimentation to convert the json data to node and edges and then return node and edges

    return { nodes, edges };
  }

  function handleSubmit() {
    try {
      const parseValue = JSON.parse(value);
      const { nodes: newNodes, edges: newEdges } =
        convertJsonToNodeAndEdges(parseValue);

      console.log(newNodes);
      console.log(newEdges);
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
    console.log(sampleJsonValue);
  }
  return (
    <>
      <Toaster position="top-right" richColors />
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

//  <div>
//       <header className="p-8 shadow-sm ">
//         <h1 className="text-3xl text-muted-foreground mb-2 font-bold">
//           JSON Tree Visualizer
//         </h1>
//         <p>Visualize your JSON data as a tree structure</p>
//       </header>
//       <div className="grid w-full gap-2 max-w-1/4 p-3">
//         <Textarea
//           className="min-h-64 max-h-full"
//           placeholder="Type your message here."
//           value={value}
//           onChange={handleChange}
//         />
//         <Button type="submit" variant="outline" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </div>
//       <Separator />
//       <div className="border border-red-500 w-4/3 ">Hellow world </div>
//     </div>
