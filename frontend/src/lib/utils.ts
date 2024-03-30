import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum ErrorCodes {
  ERROR_UPLOADING_FILE = "ERROR_UPLOADING_FILE",
  ERROR_CLONING_REPO = "ERROR_CLONING_REPO",
  ERROR_NO_REPO_URL = "ERROR_NO_REPO_URL",
  ERROR_ID_NOT_FOUND = "ERROR_ID_NOT_FOUND",
  ERROR_DEPLOYING_WEBSITE = "ERROR_DEPLOYING_WEBSITE",
  ERROR_SOMETHING_WENT_WRONG = "ERROR_SOMETHING_WENT_WRONG",
}

export enum SuccessCodes {
  SUCCESS_UPLOADING_FILE = "SUCCESS_UPLOADING_FILE",
  SUCCESS_CLONING_REPO = "SUCCESS_CLONING_REPO",
  SUCCESS_DEPLOYING_WEBSITE = "SUCCESS_DEPLOYING_WEBSITE",
}

export enum Status {
  STARTED = "STARTED",
  UPLOADED = "UPLOADED",
  BUILDING_START = "BUILDING_START",
  BUILD_SUCCESS = "BUILD_SUCCESS",
  DEPLOYED = "DEPLOYED",
  FAILED = "FAILED",
}

export function hostName(api: string, port: number = 3000) {
  return `http://localhost:${port}${api}`;
}

export function absoluteURL(api: string, ID: string = "13yungca") {
  return `http://${ID}.testingmymachine.com:3001${api}`;
}
