"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "../Button";
import {
	MdBusAlert,
	MdFlight,
	MdNightlight,
	MdNoMeals,
	MdOutlineDirectionsBusFilled,
} from "react-icons/md";
import { FaStar, FaSun, FaBreadSlice, FaBinoculars } from "react-icons/fa";
import { FaBookAtlas } from "react-icons/fa6";
import { BsFillBuildingsFill } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";

interface ListingCardProps {
	data: Listing;
	reservation?: Reservation;
	onAction?: (id: string) => void;
	disabled?: boolean;
	actionLabel?: string;
	actionId?: string;
	currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
	data,
	reservation,
	onAction,
	disabled,
	actionLabel,
	actionId = "",
	currentUser,
}) => {
	const router = useRouter();
	const { getByValue } = useCountries();
	const location = getByValue(data.locationValue);

	const handleCancel = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			if (disabled) {
				return;
			}
			onAction?.(actionId);
		},
		[onAction, actionId, disabled]
	);

	const price = useMemo(() => {
		if (reservation) {
			return reservation.totalPrice;
		}
		return data.price;
	}, [reservation, data.price]);

	let INR = new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		
	});

	const reservationDate = useMemo(() => {
		if (!reservation) {
			return null;
		}
		const start = new Date(reservation.startDate);
		const end = new Date(reservation.endDate);

		return `${format(start, "PP")} - ${format(end, "PP")}`;
	}, [reservation]);

	return (
		<div
			onClick={() => router.push(`/listings/${data.id}`)}
			className="col-span-1 cursor-pointer group"
		>
			<div className="flex flex-col gap-2 w-full">
				<div className="w-full aspect-square relative overflow-hidden rounded-xl">
					<Image
						fill
						src={data.imageSrc}
						alt="Listing"
						className="object-cover h-full w-full group-hover:scale-110 transition"
					/>
					<div className="absolute top-3 right-3">
						<HeartButton listingId={data.id} currentUser={currentUser} />
					</div>
				</div>
				<div className="font-extrabold flex justify-center">
					{data.packageName}
				</div>
				<div className="font-semibold text-lg">
					{location?.region}, {location?.label}
				</div>
				<div className="font-light text-neutral-500">
					{reservationDate || (data.catagory && data.citiesCovered)}
				</div>
				<div className="flex flex-row items-center justify-start gap-2">
					<div className=" flex flex-row items-center justify-start">
						<MdNightlight style={{ color: "blue" }} />
						{data.nights}
					</div>
					<div className=" flex flex-row items-center justify-start gap-1">
						<FaSun style={{ color: "blue" }} />
						{data.days}
					</div>
					<div className=" flex flex-row items-center justify-start">
						{data.flights ? (
							<MdFlight style={{ color: "green" }} />
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No </span>
								<MdFlight style={{ color: "red" }} />
							</div>
						)}
					</div>
					<div className=" flex flex-row items-center justify-start">
						{data.visaRequired ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">Need </span>
								<FaBookAtlas style={{ color: "red" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">No </span>
								<FaBookAtlas style={{ color: "green" }} />
							</div>
						)}
					</div>

					<div className=" flex flex-row items-center justify-start gap-1 ">
						<BsFillBuildingsFill style={{ color: "blue" }} />
						{data.hotelStar}
						<FaStar size={12} style={{ color: "blue" }} />
					</div>
				</div>

				<div className="flex flex-row items-center justify-start gap-[6px]">
					<div className=" flex flex-row items-center justify-start">
						{data.breakfast ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">Breakfast </span>
								<FaBreadSlice style={{ color: "green" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No Breakfast </span>
								<FaBreadSlice style={{ color: "red" }} />
							</div>
						)}
					</div>

					<div className=" flex flex-row items-center justify-start">
						{data.lunch ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">lunch </span>
								<GiMeal style={{ color: "green" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No lunch </span>
								<MdNoMeals style={{ color: "red" }} />
							</div>
						)}
					</div>

					<div className=" flex flex-row items-center justify-start">
						{data.dinner ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">dinner </span>
								<GiMeal style={{ color: "green" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No dinner </span>
								<MdNoMeals style={{ color: "red" }} />
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-row items-center justify-start gap-8">
					<div className=" flex flex-row items-center justify-start">
						{data.sightseeing ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">sightseeing </span>
								<FaBinoculars style={{ color: "green" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No sightseeing </span>
								<FaBinoculars style={{ color: "red" }} />
							</div>
						)}
					</div>

					<div className=" flex flex-row items-center justify-start">
						{data.transfers ? (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-green-700">transfers </span>
								<MdOutlineDirectionsBusFilled style={{ color: "green" }} />
							</div>
						) : (
							<div className="flex flex-row items-center justify-center gap-1">
								<span className="text-red-700">No transfers </span>
								<MdBusAlert style={{ color: "red" }} />
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-row items-center gap-1">
					<div className="font-semibold flex items-start justify-center">
						{INR.format(price)}
					</div>
					{!reservation && <div className="font-light">Per Person</div>}
				</div>
				{onAction && actionLabel && (
					<Button
						disabled={disabled}
						small
						label={actionLabel}
						onClick={handleCancel}
					/>
				)}
			</div>
		</div>
	);
};

export default ListingCard;
