import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hostName } from "@/lib/utils";
import { useMutation } from "react-query";
import { serverOutWebsite, ServerOutWebsite, serverIn } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardWithFormProps {
  start: boolean;
  setStart: (start: boolean) => void;
  setProjectId: (projectId: string) => void;
}

async function createProject(projectObj: ServerOutWebsite) {
  const response = await fetch(hostName("/upload"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectObj),
  });

  if (!response.ok) {
    throw new Error("Failed to upload project");
  }

  const data = await response.json();

  console.log(`data`);
  console.log(data);

  console.log(`data.extensions.id`);
  console.log(data.extensions.id);

  // if (!data.success) {
  //   throw new Error(data.message);
  // }
  return data.extensions.id;
}

const CardWithForm = ({ start, setStart, setProjectId }: CardWithFormProps) => {
  const [showError, setShowError] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  // Define the mutation
  const getProjectId = useMutation(
    (obj: ServerOutWebsite) => createProject(obj),
    {
      onSuccess: (data) => {
        console.log("Data:", data);
        // Invalidate and refetch the data from the cache
        setProjectId(data as string);
      },
      onError: (error) => {
        console.log("Error:", error);
        setShowError([`${error}` as string]);
        // If error has issues property, map it to extract error messages
        // if (error.issues) {
        //   const arrErrorString = error.issues.map((msg) => msg.message);
        //   setShowError(arrErrorString);
        // }
      },
    }
  );

  const handleNameChange = (newValue: string) => {
    setName(newValue);
  };

  const handleLinkChange = (newValue: string) => {
    setLink(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name,
      link,
    };
    const zodData = serverOutWebsite.safeParse(data);

    if (!zodData.success) {
      console.log(`zodData.error`);
      console.log(zodData.error.issues); // Check the type of zodData.error

      // Extract the error messages from the issues array
      const arrErrorString = zodData.error.issues.map((msg) => msg.message);

      setShowError(arrErrorString);
      return;
    }

    // Do something with the form data, e.g., send it to a server
    console.log("Submitted:");
    console.log(zodData.data);

    setStart(true);
    getProjectId.mutate(zodData.data);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Create Website</CardTitle>
        <CardDescription className="text-center">
          Deploy your new website in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          {showError.length > 0 &&
            showError.map((error, i) => (
              <p key={i} className="text-red-500 text-sm">
                - {error}
              </p>
            ))}
        </div>
        <form id="loginForm" onSubmit={(e) => handleSubmit(e)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                disabled={start}
                onChange={(e) => handleNameChange(e.target.value)}
                id="name"
                placeholder="Name for your website"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="link">Github Link</Label>
              <Input
                disabled={start}
                onChange={(e) => handleLinkChange(e.target.value)}
                id="link"
                placeholder="Github Link"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={start} type="submit" form="loginForm">
          Deploy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWithForm;
