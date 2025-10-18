import { ArrowRight } from "lucide-react";

import { cn, scrollToSection } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/features/authentication/components/login/login-dialog";

export const CTASection = () => {
	return (
		<section className="py-20 bg-gradient-primary relative overflow-hidden" id="connect">
			<div className="absolute inset-0 opacity-20" style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}} />

			<div className="container mx-auto px-4 relative">
				<div className="text-center space-y-8 max-w-3xl mx-auto">
					<h2 className="text-4xl lg:text-5xl text-gray-100 font-bold">
						Ready to join the
						<br />
						Vyra community?
					</h2>
					<p className="text-xl text-gray-300 leading-relaxed">
						Start connecting with people who matter, sharing moments that count,
						and discovering content that inspires. Join thousands of users already on Vyra.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<LoginDialog >
							<Button
								asChild
								size="lg"
								variant="secondary"
								className="bg-[oklch(0.99_0.01_285)] text-gray-900 hover:bg-[oklch(0.99_0.01_285)]/90 shadow-medium hover:shadow-strong transition-all duration-300 group cursor-pointer"
							>
								<div>
									Start Your Journey
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</div>
							</Button>
						</LoginDialog>

						<Button
							onClick={() => scrollToSection("explore")}
							size="lg"
							className={cn(
								"border text-gray-100 bg-gray-900 shadow-xs hover:bg-gray-800 hover:text-[oklch(0.72_0.18_285)]",
								"border-gray-200 transition-smooth"
							)}

						>
							Learn More
						</Button>
					</div>

					<p className="text-sm text-gray-300">
						Free forever • No credit card required • Join in 30 seconds
					</p>
				</div>
			</div>
		</section>
	);
};