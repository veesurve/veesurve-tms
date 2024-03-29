import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";

import PropertiesClient from "./PropertiesClient";
import getListings from "@/app/actions/getListings";

const PropertiesPage = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return <EmptyState title="Unauthorised" subtitle="Please Login" />;
	}

	const listings = await getListings({ userId: currentUser.id });

	if (listings.length === 0) {
		return (
			<EmptyState
				title="No Properties Found"
				subtitle="You haven't reserved a trip yet"
			/>
		);
	}

	return <PropertiesClient listings={listings} currentUser={currentUser} />;
};

export default PropertiesPage;
