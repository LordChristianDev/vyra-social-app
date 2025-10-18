import { useState } from "react";
import { Sidebar } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export type HoverIconProp = {
	src: string;
	className?: string;
	toggle: () => void;
}

export const HoverIcon = ({
	src,
	className,
	toggle
}: HoverIconProp) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggle}
			aria-label="Toggle sidebar"
			className="text-muted-foreground cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isHovered
				? <Sidebar />
				: <img src={src} alt="toggle-image" className={cn("", className ? className : "")} />}
		</Button>
	);
};
