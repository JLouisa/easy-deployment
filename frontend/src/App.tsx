import { useState } from "react";
import CardWithForm from "./components/Card";
import CardStatus from "./components/CardStatus";

// Create a client outside the component
function App() {
  const [start, setStart] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <main className="w-full h-full flex flex-col justify-center items-center gap-4 mt-20">
      <CardWithForm
        start={start}
        setStart={setStart}
        setProjectId={setProjectId}
      />
      {start && <CardStatus projectId={projectId} />}
    </main>
  );
}

export default App;
