import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';

function App() {
  return (
    <>
      <div className="flex justify-around gap-2 flex-1">
        <div className="grid w-full gap-2">
          <Textarea
            className="min-h-64"
            placeholder="Type your message here."
          />
          <Button variant="outline">Submit</Button>
        </div>
        <div className="border border-red-500 w-4/3">Hellow world </div>
      </div>
    </>
  );
}

export default App;
