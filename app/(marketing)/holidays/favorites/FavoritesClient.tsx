"use client";

import Container from "../../../components/Container";
import Heading from "../../../components/Heading";
import ListingCard from "../../../components/listings/ListingCard";
import { SafeListings, SafeUser } from "../../../types";

interface FavoritesClientProps {
	listings: SafeListings[];
	currentUser?: SafeUser | null;
}

export const FavoritesClient: React.FC<FavoritesClientProps> = ({
	listings,
	currentUser,
}) => {
	return (
		<Container>
			<Heading title="Favorites" subtitle="Your favorited packages" />
			<div
				className=" mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8"
			>
					{listings.map((listing)=>(
						<ListingCard 
						currentUser={currentUser}
						data={listing}
						key={listing.id}
						
						/>
					))}


			</div>
		</Container>
	);
};
