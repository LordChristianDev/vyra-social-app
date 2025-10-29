import { useState } from "react";
import { SignInButton } from '@clerk/clerk-react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const LoginDialog = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="max-w-xl max-h-[90vh] bg-[oklch(0.18_0.06_285)]">
				<DialogHeader>
					{/* Logo */}
					<div className="mb-4 flex flex-row items-center justify-center">
						<img src="/vyra.png" alt="logo" className="w-[5rem]" />
						<h1 className="font-satoshi text-4xl text-white font-bold">Vyra</h1>
					</div>

					<DialogTitle className="text-xl font-bold text-center text-white/90">
						Jump In & Join the Fun
					</DialogTitle>

					<DialogDescription className="text-center text-gray-300">
						Sign in with Google to join the fun and never miss a moment
					</DialogDescription>
				</DialogHeader>

				<SignInButton>
					<Button
						type="submit"
						className="w-full bg-violet-600 hover:bg-violet-300 cursor-pointer"
					>
						<span className="flex items-center gap-2">
							<img
								src="/svgs/google.svg"
								alt="google"
								className="size-4"
							/>
							<span className="p-18-semibold text-white"> Sign in with Google</span>
						</span>
					</Button>
				</SignInButton>

				<div className="flex justify-center">
					<p className="text-sm text-gray-400">
						Let's get started
					</p>
				</div>
			</DialogContent>
		</Dialog >
	);
};