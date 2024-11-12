import { z } from "zod";

export const authSchema = (type: "sign-in" | "sign-up") => {
	return z.object({
		email: z.string().email(),
		fullname:
			type === "sign-in"
				? z.string().optional()
				: z.string().min(1, { message: "Full name is required" }).max(50),
	});
};
