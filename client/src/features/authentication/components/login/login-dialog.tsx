import { useState } from "react";

import { useRoutes } from "@/hooks/use-routes";

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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { move } = useRoutes();

	const handleLogin = async () => {
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsLoading(false);
		move("/login");
	};

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

				<Button
					type="submit"
					onClick={handleLogin}
					className="w-full bg-violet-600 hover:bg-violet-300 cursor-pointer" disabled={isLoading}
				>
					{isLoading ? (
						<span className="flex items-center">
							<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span className="p-18-semibold text-white">Logging in...</span>
						</span>
					) : (
						<span className="flex items-center gap-2">
							<img
								src="/svgs/google.svg"
								alt="google"
								className="size-4"
							/>
							<span className="p-18-semibold text-white"> Sign in with Google</span>
						</span>
					)}
				</Button>

				<div className="flex justify-center">
					<p className="text-sm text-gray-400">
						Let's get started
					</p>
				</div>
			</DialogContent>
		</Dialog >
	);
};