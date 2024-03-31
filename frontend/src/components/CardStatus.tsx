import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Circle, CircleCheckBig, CircleX, Copy } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { serverIn } from "@/lib/schema";
import { useEffect, useState } from "react";
import { absoluteURL, hostName, Status } from "@/lib/utils";
import Loading from "./Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const [uploaded, setUploaded] = useState<boolean>(false);
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
      if (!uploaded) {
        setUploaded(true);
      }
      setBuildingStart(true);
    }
    if (data.message === Status.BUILD_SUCCESS) {
      if (!uploaded) {
        setUploaded(true);
      }
      if (!buildingStart) {
        setBuildingStart(true);
      }
      setBuildingSuccess(true);
    }
    if (data.message === Status.DEPLOYED) {
      if (!uploaded) {
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
        {failed && (
          <CardDescription className="text-center text-red-700">
            Deploying your new website failed. Please try an different project
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center">
          {uploaded ? (
            <CircleCheckBig color="green" />
          ) : !failed ? (
            <Loading />
          ) : (
            <CircleX color="red" />
          )}
          {
            <span className="ml-2 text-black">
              {!uploaded
                ? "Copying Project ..."
                : !failed
                ? "Project Uploaded Successfully!"
                : "Copying Project Failed"}
            </span>
          }
        </div>
        <div className="flex items-center">
          {!buildingSuccess && !uploaded ? (
            <Circle color="grey" />
          ) : buildingSuccess ? (
            <CircleCheckBig color="green" />
          ) : !failed ? (
            <Loading />
          ) : (
            <CircleX color="red" />
          )}
          <span
            className={`ml-2 ${uploaded ? "text-black" : "text-slate-500"}`}
          >
            {!buildingSuccess
              ? "Building Website ..."
              : !failed
              ? "Website Successfully Build!"
              : "Building Website Failed"}
          </span>
        </div>
        {
          <div className="flex items-center">
            {!deployed && !buildingSuccess ? (
              <Circle color="grey" />
            ) : deployed ? (
              <CircleCheckBig color="green" />
            ) : !failed ? (
              <Loading />
            ) : (
              <CircleX color="red" />
            )}
            <span
              className={`ml-2 ${
                buildingSuccess ? "text-black" : "text-slate-500"
              }`}
            >
              {!deployed
                ? "Deploying Your Website ..."
                : !failed
                ? "Website Successfully Deployed!"
                : "Deployment of Your Website Failed"}
            </span>
          </div>
        }
        <div className="flex flex-col space-y-1.5 mt-8">
          <Label htmlFor="link">Website Link</Label>
          <div className="relative">
            <Input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!deployed}
              id="link"
              placeholder="Your Website Link"
              value={deployed ? `${web}/index.html` : ""}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={`absolute inset-y-0 right-0 flex items-center px-2 ${
                    deployed ? "text-black" : "text-gray-400"
                  }`}
                >
                  <Copy
                    className="h-5 w-5 bg-white"
                    color="grey"
                    onClick={() => {
                      toast("Website Link Copied!");
                      navigator.clipboard.writeText(web);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleWebsiteVisit} disabled={!deployed}>
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardStatus;
