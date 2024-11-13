"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";

const handleError = (error: unknown, message: string) => {
	console.error(error, message);
	throw error;
};

const getUserByEmail = async (email: string) => {
	const { databases } = await createAdminClient();

	const result = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal("email", email)]
	);

	return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async (email: string) => {
	const { account } = await createAdminClient();

	try {
		const session = await account.createEmailToken(ID.unique(), email);

		return session.userId;
	} catch (error) {
		handleError(error, "Error sending email OTP");
	}
};

export const createAccount = async ({
	fullName,
	email,
}: {
	fullName: string;
	email: string;
}) => {
	const existingUser = await getUserByEmail(email);

	const accountId = await sendEmailOTP(email);
	if (!accountId) throw new Error("Failed to send an OTP");

	if (!existingUser) {
		const { databases } = await createAdminClient();

		await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			{
				fullName,
				email,
				avatar: "",
				accountId,
			}
		);
	}

	return parseStringify({ accountId });
};

export const verifyOTP = async ({
	accountId,
	otp,
}: {
	accountId: string;
	otp: string;
}) => {
	try {
		const { account } = await createAdminClient();

		const session = await account.createSession(accountId, otp);

		(await cookies()).set("appwrite-session", session.secret, {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			path: "/",
		});

		return parseStringify({ sessionId: session.$id });
	} catch (error) {
		handleError(error, "Error verifying OTP");
	}
};
