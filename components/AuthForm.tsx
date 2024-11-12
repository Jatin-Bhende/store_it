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
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

interface AuthFormProps {
	type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const formSchema = authSchema(type);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			fullname: "",
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
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
							name="fullname"
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
						{type === "sign-in" ? "Sign In" : "Sign Up"}
						{isLoading && (
							<Image
								src={"/assets/icons/loader.svg"}
								alt="loader"
								height={24}
								width={24}
								className="ml-2 animate-spin"
							/>
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
							href={type === "sign-in" ? "/sign-up" : "sign-in"}
							className="ml-1 font-medium text-brand"
						>
							{type === "sign-in" ? "Sign up" : "Sign in"}
						</Link>
					</div>
				</form>
			</Form>
		</>
	);
};

export default AuthForm;
