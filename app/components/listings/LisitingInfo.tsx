"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "@/app/components/Avatar";
import ListingCategory from "./LisitingCategory";

interface LisitingInfoProps {
	user: SafeUser;
	category:
		| {
				icon: IconType;
				label: string;
				description: string;
		  }
		| undefined;
	description: string;
	days: number;
	nights: number;
	locactionValue: string;
	id?: string;
}

const ListingInfo: React.FC<LisitingInfoProps> = ({
	user,
	category,
	description,
	days,
	nights,
	locactionValue,
	id,
}) => {
	const { getByValue } = useCountries();

	const coordinates = getByValue(locactionValue)?.latlng;

	return (
		<div className="col-span-4 flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<div className="flex flex-row text-xl font-semibold items-center gap-2">
					<div>Hosted by {user?.name}</div>
					<Avatar src={user?.image} />
				</div>
				<div className="flex flex-row items-center gap-4 font-light text-neutral-500">
					<div>{nights} Nights</div>
					<div>{days} Days</div>
				</div>
				<hr />
				{category && (
					<ListingCategory
						icon={category.icon}
						label={category?.label}
						description={category?.description}
					/>
				)}
    <hr />
			</div>
		</div>
	);
};

export default ListingInfo;
