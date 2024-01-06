import { Nunito } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import Navbar from "./components/navbar/Navbar";

import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providors/ToasterProvider";

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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				<ToasterProvider />
				<RegisterModal />
				<Navbar />
				{children}
			</body>
		</html>
	);
}
