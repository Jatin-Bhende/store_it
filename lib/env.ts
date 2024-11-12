import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string(),
	NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string(),
	NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string(),
	NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID: z.string(),
	NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID: z.string(),
	NEXT_PUBLIC_APPWRITE_BUCKET_ID: z.string(),
	APPWRITE_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
