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
import { absoluteURL, hostName, Status } from "@/lib/utils";
import Loading from "./Loading";

const POLLING_INTERVAL = 1000; // Polling interval in milliseconds

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
  const [Uploaded, setUploaded] = useState<boolean>(false);
  const [buildingStart, setBuildingStart] = useState<boolean>(false);
  const [buildingSuccess, setBuildingSuccess] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [web, setWeb] = useState<string>("");

  // Define a function to fetch status and initiate polling
  const fetchData = async () => {
    const data = await getStatus(projectId as string); // Call your API function to fetch status
    console.log("Status");
    console.log(data.message);

    if (data.message === Status.UPLOADED) {
      setUploaded(true);
    }
    if (data.message === Status.BUILDING_START) {
      if (!Uploaded) {
        setUploaded(true);
      }
      setBuildingStart(true);
    }
    if (data.message === Status.BUILD_SUCCESS) {
      if (!Uploaded) {
        setUploaded(true);
      }
      if (!buildingStart) {
        setBuildingStart(true);
      }
      setBuildingSuccess(true);
    }
    if (data.message === Status.DEPLOYED) {
      if (!Uploaded) {
        setUploaded(true);
      }
      if (!buildingStart) {
        setBuildingStart(true);
      }
      if (!buildingSuccess) {
        setBuildingSuccess(true);
      }
      const webLink = `${absoluteURL("/index.html", projectId as string)}`;
      setDeployed(true);
      setWeb(webLink);
    }
    if (data.message === Status.FAILED) {
      setFailed(true);
    }
    // If status is not the one we are expecting, initiate polling after the polling interval
    if (data.message !== Status.DEPLOYED && data.message !== Status.FAILED) {
      setTimeout(fetchData, POLLING_INTERVAL);
    }
  };

  // Call fetchData when component mounts
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]); //

  function handleWebsiteVisit() {
    window.open(web, "_blank");
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center">
          {Uploaded ? <CircleCheckBig color="green" /> : <Loading />}
          {Uploaded ? (
            <span className="ml-2">Project Uploaded Successfully!</span>
          ) : (
            <span className="ml-2">Copying Project ...</span>
          )}
        </div>
        {buildingStart && (
          <div className="flex items-center">
            {buildingSuccess ? <CircleCheckBig color="green" /> : <Loading />}
            {buildingSuccess ? (
              <span className="ml-2">Website Successfully Build!</span>
            ) : (
              <span className="ml-2">Building Website ...</span>
            )}
          </div>
        )}
        {buildingSuccess && (
          <div className="flex items-center">
            {deployed ? <CircleCheckBig color="green" /> : <Loading />}
            {deployed ? (
              <span className="ml-2">Website Successfully Deployed!</span>
            ) : (
              <span className="ml-2">Deploying Your Website ...</span>
            )}
          </div>
        )}
        <div className="flex flex-col space-y-1.5 mt-8">
          <Label htmlFor="link">Website Link</Label>
          <Input
            disabled={!deployed}
            id="link"
            placeholder="Your Website Link"
            value={deployed ? `${web}/index.html` : ""}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => handleWebsiteVisit()} disabled={!deployed}>
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardStatus;
