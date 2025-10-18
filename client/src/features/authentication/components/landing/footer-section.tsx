export const FooterSection = () => {
	return (
		<footer className="py-12 bg-white border-t border-border">
			<div className="container mx-auto px-4">
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center	 cursor-pointer">
						<img src="/vyra.png" alt="logo" className="w-[4rem]" />
						<span className="font-satoshi font-bold text-xl text-primary">Vyra</span>
					</div>

					<p className="text-muted-foreground">
						Built with ❤️ for meaningful connections
					</p>
					<div className="flex justify-center space-x-6 text-sm text-muted-foreground">
						<a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a>
						<a href="#" className="hover:text-primary transition-smooth">Terms of Service</a>
						<a href="#" className="hover:text-primary transition-smooth">Contact</a>
					</div>
				</div>
			</div>
		</footer>
	);
};