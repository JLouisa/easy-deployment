import { Button } from "@/components/ui/button";
import loading from "@/assets/loading.svg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CircleCheckBig, CircleX } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const CardStatus = () => {
  const dev = true;
  const dev2 = true;
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center">
          {dev ? (
            <CircleCheckBig color="green" />
          ) : dev2 ? (
            <CircleX color="red" />
          ) : (
            <img src={loading} />
          )}
          {dev ? (
            <span className="ml-2">Website Uploaded Successfully!</span>
          ) : (
            <span className="ml-2">Copying Website ...</span>
          )}
        </div>
        <div className="flex items-center">
          {dev ? (
            <CircleCheckBig color="green" />
          ) : dev2 ? (
            <CircleX color="red" />
          ) : (
            <img src={loading} />
          )}
          {dev ? (
            <span className="ml-2">Website Deployed Successfully!</span>
          ) : (
            <span className="ml-2">Deploying Your Website ...</span>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="link">Website Link</Label>
          <Input id="link" placeholder="Website Link" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>Visit</Button>
      </CardFooter>
    </Card>
  );
};

export default CardStatus;
