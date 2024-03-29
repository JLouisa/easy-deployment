import CardWithForm from "./components/Card";
import CardStatus from "./components/CardStatus";
import { useQuery } from "react-query";

async function getStatus() {
  const response = await fetch("http://localhost:3000/status");
  return await response.json();
}

function App() {
  // const { isLoading, isError, data, error } = useQuery("status", getStatus);

  return (
    <main className="w-full h-full flex flex-col justify-center items-center gap-4 mt-20">
      <CardWithForm />
      <CardStatus />
    </main>
  );
}

export default App;
