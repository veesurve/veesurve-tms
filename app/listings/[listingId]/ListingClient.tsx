"use client";

import Container from "@/app/components/Container";
import ListingInfo from "@/app/components/listings/LisitingInfo";
import ListingHead from "@/app/components/listings/ListingHead";
import { catagories } from "@/app/components/navbar/Catagories";
import { SafeListings, SafeUser } from "@/app/types";
import { Reservation } from "@prisma/client";
import { useMemo } from "react";

interface ListingClientProps {
	reservations?: Reservation[];
	listing: SafeListings & {
		user: SafeUser;
	};
	currentUser: SafeUser | null;
}

const LisitingClient: React.FC<ListingClientProps> = ({
	listing,
	currentUser,
}) => {
	const category = useMemo(() => {
		return catagories.find((item) => item.label === listing.category);
	}, [listing.category]);
	return (
		<Container>
			<div className="mx-auto max-w-screen-lg">
				<div className="flex flex-col gap-6">
					<ListingHead
						title={listing.packageName}
						imageSrc={listing.imageSrc}
						locationValue={listing.locationValue}
						id={listing.id}
						currentUser={currentUser}
					/>
					<div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
						<ListingInfo
							user={listing.user}
							category={category}
							description={listing?.citiesCovered} //change to description after new update to db & listing
							days={listing.days}
							nights={listing.nights}
							locactionValue={listing.locationValue}
							id={listing.id}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default LisitingClient;
