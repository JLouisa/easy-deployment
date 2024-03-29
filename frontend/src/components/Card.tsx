import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardWithForm = () => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

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
    // Do something with the form data, e.g., send it to a server
    console.log("Submitted:", { name, link });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Create Website</CardTitle>
        <CardDescription className="text-center">
          Deploy your new website in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                onChange={() => handleNameChange}
                id="name"
                placeholder="Name for your website"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="link">Github Link</Label>
              <Input
                onChange={() => handleLinkChange}
                id="link"
                placeholder="Github Link"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
};

export default CardWithForm;
