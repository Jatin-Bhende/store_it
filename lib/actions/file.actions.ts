"use server";

import { RenameFileProps, UploadFileProps } from "@/types";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
	console.error(error, message);
	throw error;
};

const createQueries = (currentUser: Models.Document) => {
	const queries = [
		Query.or([
			Query.equal("owner", [currentUser.$id]),
			Query.contains("users", [currentUser.email]),
		]),
	];

	// TODO: Modify query based on search, sort and limit
	return queries;
};

export const uploadFile = async ({
	file,
	ownerId,
	accountId,
	path,
}: UploadFileProps) => {
	const { storage, databases } = await createAdminClient();

	try {
		const inputFile = InputFile.fromBuffer(file, file.name);

		const bucketFile = await storage.createFile(
			appwriteConfig.bucketId,
			ID.unique(),
			inputFile
		);

		const fileDocument = {
			type: getFileType(bucketFile.name).type,
			name: bucketFile.name,
			url: constructFileUrl(bucketFile.$id),
			extension: getFileType(bucketFile.name).extension,
			size: bucketFile.sizeOriginal,
			owner: ownerId,
			accountId,
			users: [],
			bucketFileId: bucketFile.$id,
		};

		const newFile = await databases
			.createDocument(
				appwriteConfig.databaseId,
				appwriteConfig.filesCollectionId,
				ID.unique(),
				fileDocument
			)
			.catch(async (error: unknown) => {
				await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
				handleError(error, "Failed to upload file");
			});

		revalidatePath(path);

		return parseStringify(newFile);
	} catch (error) {
		handleError(error, "Error uploading file");
	}
};

export const getFiles = async () => {
	const { databases } = await createAdminClient();

	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) throw new Error("USer not found!");

		const queries = createQueries(currentUser);

		const files = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			queries
		);

		return parseStringify(files);
	} catch (error) {
		handleError(error, "Error while getting files");
	}
};

export const renameFile = async ({
	fileId,
	name,
	extension,
	path,
}: RenameFileProps) => {
	const { databases } = await createAdminClient();

	try {
		const newName = `${name}.${extension}`;

		const updatedFile = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				name: newName,
			}
		);

		revalidatePath(path);
		return parseStringify(updatedFile);
	} catch (error) {
		handleError(error, "Error while renaming file");
	}
};
