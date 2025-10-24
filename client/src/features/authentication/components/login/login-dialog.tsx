import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { OAuthButton } from "@stackframe/react";

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

				<OAuthButton provider="google" type="sign-in" />

				<div className="flex justify-center">
					<p className="text-sm text-gray-400">
						Let's get started
					</p>
				</div>
			</DialogContent>
		</Dialog >
	);
};