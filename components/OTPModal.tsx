"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "./ui/button";
import { sendEmailOTP, verifyOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const OTPModal = ({
	email,
	accountId,
}: {
	email: string;
	accountId: string;
}) => {
	const [isOpen, setIsOpen] = useState(true);
	const [otp, setOTP] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async (ev: React.MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		setIsLoading(true);

		try {
			const sessionId = await verifyOTP({
				accountId,
				otp,
			});

			if (sessionId) router.push("/");
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOTP = async () => {
		await sendEmailOTP(email);
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent className="shad-alert-dialog">
				<AlertDialogHeader className="relative flex justify-center">
					<AlertDialogTitle className="h2 text-center">
						Enter your OTP{" "}
						<Image
							src="/assets/icons/close-dark.svg"
							alt="close"
							width={20}
							height={20}
							onClick={() => setIsOpen(false)}
							className="otp-close-button"
						/>
					</AlertDialogTitle>
					<AlertDialogDescription>
						We&apos;ve sent you an email with the OTP to{" "}
						<span className="pl-1 text-brand">{email}</span>.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<InputOTP
					maxLength={6}
					value={otp}
					onChange={setOTP}
					pattern={REGEXP_ONLY_DIGITS}
				>
					<InputOTPGroup className="shad-otp">
						<InputOTPSlot index={0} className="shad-otp-slot" />
						<InputOTPSlot index={1} className="shad-otp-slot" />
						<InputOTPSlot index={2} className="shad-otp-slot" />
						<InputOTPSlot index={3} className="shad-otp-slot" />
						<InputOTPSlot index={4} className="shad-otp-slot" />
						<InputOTPSlot index={5} className="shad-otp-slot" />
					</InputOTPGroup>
				</InputOTP>
				<AlertDialogFooter>
					<div className="flex w-full flex-col gap-4">
						<AlertDialogAction
							onClick={handleSubmit}
							className="shad-submit-btn h-12"
							type="button"
						>
							{isLoading ? (
								<Image
									src={"/assets/icons/loader.svg"}
									alt="loader"
									height={24}
									width={24}
									className="ml-2 animate-spin"
								/>
							) : (
								"Submit"
							)}
						</AlertDialogAction>
						<div className="subtitle-2 mt-2 text-center text-light-100">
							Didn&apos;t get a code?
							<Button
								type="button"
								variant={"link"}
								className="pl-1 text-brand"
								onClick={handleResendOTP}
							>
								Resend OTP
							</Button>
						</div>
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default OTPModal;
