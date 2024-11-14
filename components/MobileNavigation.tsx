"use client";

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { MobileNavigationProps } from "@/types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { signOut } from "@/lib/actions/user.actions";

const MobileNavigation = ({
	$id: ownerId,
	accountId,
	fullName,
	email,
}: MobileNavigationProps) => {
	const [open, setOpen] = useState(false);
	const pathName = usePathname();

	return (
		<header className="mobile-header">
			<Image
				src={"/assets/icons/logo-full-brand.svg"}
				alt="logo"
				width={120}
				height={52}
				className="h-auto"
			/>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger>
					<Image
						src={"/assets/icons/menu.svg"}
						alt="menu"
						width={30}
						height={30}
					/>
				</SheetTrigger>
				<SheetContent className="shad-sheet h-screen px-3">
					<SheetTitle>
						<div className="header-user">
							<FaUser width={88} height={88} className="header-user-avatar" />
							<div className="sm:hidden lg:block">
								<p className="subtitle-2 capitalize">{fullName}</p>
								<p className="caption">{email}</p>
							</div>
						</div>
						<Separator className="mb-4 bg-light-200/20" />
					</SheetTitle>
					<nav className="mobile-nav">
						<ul className="mobile-nav-list">
							{navItems.map(({ name, icon, url }) => (
								<Link href={url} key={name} className="lg:w-full">
									<li
										className={cn(
											"mobile-nav-item",
											pathName === url && "shad-active"
										)}
									>
										<Image
											src={icon}
											alt={name}
											width={24}
											height={24}
											className={cn(
												"nav-icon",
												pathName === url && "nav-icon-active"
											)}
										/>
										<p>{name}</p>
									</li>
								</Link>
							))}
						</ul>
					</nav>
					<Separator className="my-5 bg-light-200/20" />
					<div className="flex flex-col justify-between gap-5 pb-5">
						<FileUploader ownerId={ownerId} accountId={accountId} />

						<Button
							type="submit"
							className="mobile-sign-out-button"
							onClick={async () => await signOut()}
						>
							<Image
								src={"/assets/icons/logout.svg"}
								alt="logout"
								width={24}
								height={24}
								className="w-6"
							/>
							<p>Logout</p>
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</header>
	);
};

export default MobileNavigation;
