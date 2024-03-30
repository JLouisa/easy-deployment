import { z } from "zod";

export const serverIn = z.object({
  message: z.string(),
  extensions: z.object({
    id: z.string().optional(),
    code: z.string(),
  }),
});
export type ServerIn = z.infer<typeof serverIn>;

export const serverOutWebsite = z.object({
  name: z.string().trim().toLowerCase(),
  link: z
    .string()
    .includes("github.com", {
      message: "Please provide a link from github react project",
    })
    .toLowerCase()
    .url({ message: "Please provide a valid github project url" }),
});
export type ServerOutWebsite = z.infer<typeof serverOutWebsite>;
