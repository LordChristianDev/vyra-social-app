"use client"

import { useState, useEffect, forwardRef } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends Omit<React.ComponentProps<"input">, "type"> {
	// Additional props specific to DatePicker can go here if needed
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	({ value, defaultValue, onChange, onBlur, name, disabled, className, ...props }, ref) => {

		// Helper function to safely parse date
		const parseDate = (dateValue: string | undefined) => {
			if (!dateValue) return undefined;

			// Handle both "YYYY-MM-DD" and "YYYY-MM-DD HH:mm:ss" formats
			const date = new Date(dateValue);

			// Check if date is valid
			if (isNaN(date.getTime())) {
				console.error('Invalid date:', dateValue);
				return undefined;
			}

			return date;
		};

		// Use value prop (from RHF) or fallback to defaultValue
		const [date, setDate] = useState<Date | undefined>(() => {
			const initialValue = (value as string) || (defaultValue as string);
			return parseDate(initialValue);
		});

		const [isOpen, setIsOpen] = useState(false);

		// Handle date selection
		const handleDateSelect = (selectedDate: Date | undefined) => {
			setDate(selectedDate);
			if (onChange) {
				// Use date-only format to match your backend format
				const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

				// Create a synthetic event for React Hook Form compatibility
				const syntheticEvent = {
					target: {
						value: formattedDate,
						name: name || "",
					},
					type: "change"
				} as React.ChangeEvent<HTMLInputElement>;

				onChange(syntheticEvent);
			}
			setIsOpen(false); // Close popover after selection
		};

		// Handle popover close (blur equivalent)
		const handlePopoverClose = () => {
			setIsOpen(false);
			if (onBlur) {
				// Create a synthetic event for React Hook Form compatibility
				const syntheticEvent = {
					target: {
						value: date ? format(date, "yyyy-MM-dd") : "",
						name: name || "",
					},
					type: "blur"
				} as React.FocusEvent<HTMLInputElement>;

				onBlur(syntheticEvent);
			}
		};

		// Effect to handle external value changes (from RHF)
		useEffect(() => {
			const currentValue = (value as string) || (defaultValue as string);
			const parsedDate = parseDate(currentValue);
			setDate(parsedDate);
		}, [value, defaultValue]);

		return (
			<>
				<input
					ref={ref}
					type="hidden"
					name={name}
					value={date ? format(date, "yyyy-MM-dd") : ""}
					{...props}
				/>

				<Popover open={isOpen} onOpenChange={(open) => {
					if (!open) {
						handlePopoverClose();
					} else {
						setIsOpen(true);
					}
				}}>
					<PopoverTrigger asChild>
						<Button
							name={name}
							disabled={disabled}
							variant="outline"
							data-empty={!date}
							className={`data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full ${className || ""}`}
						>
							<CalendarIcon />
							{date ? format(date, "MMMM dd, yyyy") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0">
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={handleDateSelect}
							disabled={disabled}
						/>
					</PopoverContent>
				</Popover>
			</>
		)
	}
)

DatePicker.displayName = "DatePicker"