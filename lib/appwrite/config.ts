import { env } from "@/lib/env";

export const appwriteConfig = {
	endpointUrl: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
	projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
	databaseId: env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
	usersCollectionId: env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
	filesCollectionId: env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
	bucketId: env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
	secretKey: env.APPWRITE_SECRET_KEY,
};
