import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return NextResponse.error();
	}

	const body = await request.json();
	// console.log(body);

	const {
		category,
		packageName,
		destination,
		citiesCovered,
		departureCity,
		nights,
		days,
		flights,
		visaRequired,
		hotelStar,
		breakfast,
		lunch,
		dinner,
		sightseeing,
		transfers,
		price,
		emi,
		emiMonths,
		keyHighlights,
		itenary,
		inclusions,
		exclusions,
		tnc,
		imageSrc,

	} = body;

	const listing = await prisma.listing.create({
		data: {
			catagory: category,
			packageName,
			destination: destination.label,
			citiesCovered,
			departureCity,
			nights,
			days,
			flights: JSON.parse(flights),
			visaRequired: JSON.parse(visaRequired),
			hotelStar:parseInt(hotelStar,10),
			breakfast: JSON.parse(breakfast),
			lunch: JSON.parse(lunch),
			dinner: JSON.parse(dinner),
			sightseeing: JSON.parse(sightseeing),
			transfers: JSON.parse(transfers),
			price: parseInt(price, 10),
			emi: JSON.parse(emi),
			emiMonths:parseInt(emiMonths,10),
			keyHighlights,
			itenary,
			inclusions,
			exclusions,
			tnc,
			imageSrc,
			locationValue: destination.value,
			userId: currentUser.id,
		},
	});

	return NextResponse.json(listing);
}
