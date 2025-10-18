import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoginDialog } from "../login/login-dialog";


export const HeroSection = () => {
	return (
		<div className="container mx-auto pt-8 relative max-w-7xl">
			<div className="flex flex-wrap gap-12 items-center animate-fade-in">
				<div className="flex-1 space-y-8 ">
					<div className="space-y-4">
						<Badge
							variant="secondary"
							className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-smooth"
						>
							✨ Welcome to the future of social media
						</Badge>

						<h1 className="mb-6 text-4xl md:text-6xl font-bold text-gray-900">
							Connect with your {" "}
							<span className="bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent animate-gradient bg-[length:100%_auto]">
								community
							</span>
						</h1>

						<p className="text-xl text-muted-foreground leading-relaxed">
							Connect with friends, share your moments, and discover amazing content in a beautiful,
							privacy-first social media experience designed for the modern world.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						<LoginDialog >
							<Button
								asChild
								size="lg"
								className="bg-gradient-primary hover:opacity-90 shadow-medium hover:shadow-strong transition-all duration-300 group"
							>
								<div className="text-white animate-float">
									Get Started Free
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</div>
							</Button>
						</LoginDialog>

						<Button
							asChild
							size="lg"
							className={cn(
								"border text-gray-900 bg-[oklch(0.99_0.01_285)] shadow-xs hover:bg-[oklch(0.96_0.05_295)] hover:text-[oklch(0.72_0.18_285)]",
								"border-primary/20 hover:bg-primary/5 transition-smooth"
							)}
						>
							<a
								href="https://lord-christian-portfolio.vercel.app/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="portfolio"
								className="text-gray-900"
							>
								Watch Demo
							</a>
						</Button>
					</div>
				</div>

				<div className="relative flex-1">
					<img
						src="/images/social_media_guy.png"
						alt="Vyra Platform Preview"
						className="relative rounded-3xl w-full"
					/>
				</div>
			</div>
		</div >
	);
};