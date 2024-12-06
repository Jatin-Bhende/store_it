"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export const signUp = async ({
	fullName,
	email,
}: {
	fullName: string;
	email: string;
}) => {
	const existingUser = await getUserByEmail(email);
	if (existingUser) throw new Error("Email is already in use!");

	const accountId = await sendEmailOTP(email);
	if (!accountId) throw new Error("Failed to send an OTP!");

	const { databases } = await createAdminClient();

	await databases.createDocument(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		ID.unique(),
		{
			fullName,
			email,
			avatar: "", // TODO: Add avatar feature
			accountId,
		}
	);

	return parseStringify({ accountId });
};

export const signIn = async (email: string) => {
	const existingUser = await getUserByEmail(email);
	if (!existingUser) throw new Error("User not found!");

	const accountId = await sendEmailOTP(email);
	if (!accountId) throw new Error("Failed to send an OTP!");

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

		if (otp.length !== 6) {
			throw new Error("Invalid OTP!");
		}
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

export const getCurrentUser = async () => {
	try {
		const { databases, account } = await createSessionClient();

		const result = await account.get();

		const user = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			[Query.equal("accountId", result.$id)]
		);

		if (user.total <= 0) return null;

		return parseStringify(user.documents[0]);
	} catch (error) {
		handleError(error, "Error getting current user");
	}
};

export const signOut = async () => {
	const { account } = await createSessionClient();
	try {
		await account.deleteSession("current");
		(await cookies()).delete("appwrite-session");
	} catch (error) {
		handleError(error, "Error signing out");
	} finally {
		redirect("/sign-in");
	}
};
