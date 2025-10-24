import { scrollToSection } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/features/authentication/components/login/login-dialog";

import { AppbarNavItems } from "@/services/layout-services";

export const Navbar = () => {
	return (
		<header>
			<nav className="container mx-auto flex items-center justify-between max-w-7xl h-20">
				<button onClick={() => scrollToSection("hero")}>
					<div className="flex items-center gap-2 cursor-pointer">
						<img src="/vyra.png" alt="logo" className="w-[4rem]" />
						<span className="font-satoshi font-bold text-xl text-primary">Vyra</span>
					</div>
				</button>

				<div className="hidden md:flex items-center space-x-8">
					<ul className="flex items-center gap-6"><AppbarNavs /></ul>

					<LoginDialog >
						<Button className="bg-gradient-primary hover:opacity-90 shadow-medium hover:shadow-strong transition-all duration-300 group">
							<span className="p-18-semibold text-white">Join Us</span>
						</Button>
					</LoginDialog>

				</div>
			</nav>
		</header>
	);
};

function AppbarNavs() {
	const renderNavs = AppbarNavItems.map((nav) => {
		const { title, href } = nav;

		return (
			<li key={title}>
				<button
					onClick={() => scrollToSection(href)}
					className="text-md font-base text-gray-800 hover:text-primary transition-colors capitalize relative group cursor-pointer"
				>
					{title}
					<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
				</button>
			</li>
		);
	});

	return (renderNavs);
};

