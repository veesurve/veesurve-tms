import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
	userId?: string;
	startDate?: string;
	endDate?: string;
	locationValue?: string;
	category?: string;
	flights?: boolean;
}

const changeBool = (value: boolean) => {
	if (value === true) {
		return "true";
	}
	if (value === false) {
		return "false";
	}
};
export default async function getListings(params: IListingsParams) {
	try {
		const { userId, startDate, endDate, locationValue, flights, category } =
			params;

		let query: any = {};
		if (userId) {
			query.userId = userId;
		}
		if (category) {
			query.category = category;
		}
		if (locationValue) {
			query.locationValue = locationValue;
		}
		if (flights) {
			query.flights = changeBool(flights);
		}

		const listings = await prisma.listing.findMany({
			where: query,
			orderBy: {
				price: "asc",
			},
		});

		const safeListings: any = listings.map((listing) => ({
			...listing,
			createdAt: listing.createdAt.toISOString(),
		}));

		return safeListings;
	} catch (error: any) {
		throw new Error(error);
	}
}
