import { Button } from "@/components/ui/button";
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
import { serverIn } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { hostName, Status } from "@/lib/utils";
import Loading from "./Loading";

const POLLING_INTERVAL = 2000; // Polling interval in milliseconds

async function getStatus(id: string) {
  const response = await fetch(hostName(`/status/${id}`));
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = serverIn.safeParse(await response.json());

  if (!data.success) {
    throw new Error("Failed to fetch data");
  }
  return data.data;
}

const CardStatus = ({ projectId }: { projectId: string | null }) => {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [building, setBuilding] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  // Define a function to fetch status and initiate polling
  const fetchData = async () => {
    const data = await getStatus(projectId as string); // Call your API function to fetch status
    console.log("Status");
    console.log(data.message);

    if (data.message === Status.UPLOADED) {
      setUploaded(true);
    }
    if (data.message === Status.BUILDING) {
      setBuilding(true);
    }
    if (data.message === Status.DEPLOYED) {
      setDeployed(true);
    }
    // If status is not the one we are expecting, initiate polling after the polling interval
    if (data.message !== Status.DEPLOYED) {
      setTimeout(fetchData, POLLING_INTERVAL);
    }
  };

  // Call fetchData when component mounts
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]); //

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center">
          {uploaded || building ? (
            <CircleCheckBig color="green" />
          ) : (
            <Loading />
          )}
          {uploaded || building ? (
            <span className="ml-2">Project Uploaded Successfully!</span>
          ) : (
            <span className="ml-2">Copying Project ...</span>
          )}
        </div>
        {uploaded ||
          (building && (
            <div className="flex items-center">
              {building ? <CircleCheckBig color="green" /> : <Loading />}
              {building ? (
                <span className="ml-2">Website Successfully build!</span>
              ) : (
                <span className="ml-2">Building Website ...</span>
              )}
            </div>
          ))}
        {building && (
          <div className="flex items-center">
            {deployed ? <CircleCheckBig color="green" /> : <Loading />}
            {deployed ? (
              <span className="ml-2">Website Successfully Deployed!</span>
            ) : (
              <span className="ml-2">Deploying Your Website ...</span>
            )}
          </div>
        )}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="link">Website Link</Label>
          <Input disabled={!deployed} id="link" placeholder="Website Link" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={!deployed}>Visit</Button>
      </CardFooter>
    </Card>
  );
};

export default CardStatus;
