"use client";

import { authSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { signIn, signUp } from "@/lib/actions/user.actions";
import OTPModal from "@/components/OTPModal";

interface AuthFormProps {
	type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [accountId, setAccountId] = useState("");

	const formSchema = authSchema(type);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			fullName: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setErrorMessage("");

		try {
			if (type === "sign-in") {
				const user = await signIn(values.email);
				setAccountId(user.accountId);
			} else {
				const user = await signUp({
					fullName: values.fullName || "",
					email: values.email,
				});
				setAccountId(user.accountId);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
					<h1 className="form-title">
						{type === "sign-in" ? "Sign In" : "Sign Up"}
					</h1>
					{type === "sign-up" && (
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<div className="shad-form-item">
										<FormLabel className="shad-form-label">Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
												className="shad-input"
											/>
										</FormControl>
									</div>
									<FormMessage className="shad-form-message" />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="shad-form-item">
									<FormLabel className="shad-form-label">Email</FormLabel>
									<FormControl>
										<Input
											placeholder="johndoe@example.com"
											{...field}
											className="shad-input"
										/>
									</FormControl>
								</div>
								<FormMessage className="shad-form-message" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="form-submit-button"
						disabled={isLoading}
					>
						{isLoading ? (
							<Image
								src={"/assets/icons/loader.svg"}
								alt="loader"
								height={24}
								width={24}
								className="ml-2 animate-spin"
							/>
						) : type === "sign-in" ? (
							"Sign In"
						) : (
							"Sign Up"
						)}
					</Button>

					{errorMessage && <p className="error-message">*{errorMessage}</p>}

					<div className="body-2 flex justify-center">
						<p className="text-light-100">
							{type === "sign-in"
								? "Don't have an account?"
								: "Already have an account?"}
						</p>
						<Link
							href={type === "sign-in" ? "/sign-up" : "/sign-in"}
							className="ml-1 font-medium text-brand"
						>
							{type === "sign-in" ? "Sign up" : "Sign in"}
						</Link>
					</div>
					{accountId && (
						<OTPModal email={form.getValues("email")} accountId={accountId} />
					)}
				</form>
			</Form>
		</>
	);
};

export default AuthForm;
