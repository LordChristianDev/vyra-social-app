import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AvatarIconProps = {
	src?: string;
	fallback: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const sizeClasses: Record<NonNullable<AvatarIconProps['size']>, string> = {
	'sm': 'h-8 w-8 text-sm',
	'md': 'h-10 w-10 text-base',
	'lg': 'h-12 w-12 text-lg',
	'xl': 'h-16 w-16 text-xl',
	'2xl': 'h-20 w-20 text-2xl',
	'3xl': 'h-24 w-24 text-2xl',
};

export const AvatarIcon = ({ src, fallback, className, size = 'md' }: AvatarIconProps) => {
	return (
		<Avatar className={cn(sizeClasses[size], className)}>
			<AvatarImage src={src} alt={fallback} />
			<AvatarFallback className="bg-gradient-primary text-primary-foreground">
				{fallback}
			</AvatarFallback>
		</Avatar>
	);
};