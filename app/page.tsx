import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import { SafeListings } from "./types";

interface HomeProps {
	searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
	const listings = await getListings(searchParams);
	const currentUser = await getCurrentUser();
	// console.log(listings);

	// const isEmpty = true;
	if (listings.length === 0) {
		return (
			<div>
				<EmptyState showReset />
			</div>
		);
	}
	return (
		<Container>
			<div className=" pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{listings.map((listing: SafeListings) => {
					return (
						<ListingCard
							currentUser={currentUser}
							key={listing.id}
							data={listing}
							userDetails
							reservationDetails
						/>
					);
				})}
			</div>
		</Container>
	);
};

export default Home;
