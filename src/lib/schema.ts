import { z } from "zod";

export const formSchema = z.object({
	name: z.string(),
	tally: z.number().max(100).min(-100)
});
