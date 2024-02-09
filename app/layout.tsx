import { Nunito } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import Navbar from "./components/navbar/Navbar";

import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providors/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModel";
import PhoneModel from "./components/modals/PhoneModel";
import SearchModel from "./components/modals/SearchModel";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "VeeSurve Experiances",
	description: "Event Managment| Travel| Holidays",
	icons: [
		{
			url: "/images/logo.png",
			href: "/images/logo.png",
		},
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentUser = await getCurrentUser();

	return (
		<html lang="en">
			<body className={font.className}>
				<ToasterProvider />
				<SearchModel />
				<RegisterModal />
				<LoginModal />
				<PhoneModel />
				<RentModal />
				<Navbar currentUser={currentUser} />
				<div className="pb-20 pt-28">{children}</div>
			</body>
		</html>
	);
}
