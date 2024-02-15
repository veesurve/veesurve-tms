"use client";

import { NavbarHome } from "@/app/_components/navbar-home";

import { Button } from "@/app/components/ui/button";
import { InputS } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { ImWhatsapp } from "react-icons/im";

const ContactPage = () => {
	const router = useRouter();
	return (
		<>
			<div className="h-full w-full p-5 bg-gray-100 flex flex-col gap-4 items-center mt-[110px]">
				{/* navbar */}
				<NavbarHome />
				<h1 className=" font-bold text-2xl uppercase">Vee Surve Experiences</h1>
				<div
					id="container"
					className=" w-full h-[70vh] flex gap-2  items-center flex-col "
				>
					<h1>Contact Us</h1>
					<div id="container" className="flex flex-row gap-2 w-full px-1">
						<div
							id="left"
							className="w-3/4 p-3 flex flex-col rounded-md border"
						>
							<h1>Drop us Line</h1>
							<div id="formContainer">
								<div id="elemContainer">
									<label htmlFor="">Name</label>
									<InputS type="text" placeholder="Please enter your name" />
								</div>
								<div id="elemContainer">
									<label htmlFor="">Email</label>
									<InputS type="email" placeholder="Please enter your Email" />
								</div>
								<div id="elemContainer">
									<label htmlFor="">Phone</label>
									<InputS type="tel" placeholder="Please enter your name" />
								</div>
								<div id="elemContainer">
									<label htmlFor="">Message</label>
									<Textarea placeholder="Type your message here" id="message" />
								</div>
								<Button className="w-full mt-3 group border hover:border-neutral-900 rounded-full font-semibold text-md hover:bg-neutral-100 bg-neutral-900 text-white border-white p-2">
									<p className="mr-2 group-hover:text-neutral-900 text-white">
										Send Message
									</p>
									<BsFillSendFill className="group-hover:animate-ping group-hover:text-neutral-900 transition text-white" />
								</Button>
							</div>
						</div>
						<div
							id="right"
							className="w-1/4 p-3 flex flex-col gap-3 border rounded-lg"
						>
							<div className="flex flex-col gap-4 ">
								<p>
									Better yet, see us in person!. We love our customers, so feel
									free to contact us to schedule an appointment
								</p>
								<div>
									<p>
										<span className="underline mr-2">Phone:</span>
										+91-9910173131
									</p>
								</div>
								<div>
									<p>
										<span className="underline mr-2">Email: </span>
										<a
											href="mailto:experiences@veesurve.com?subject=Email from your Website&body=Let's connect via email"
											className="bg-neutral-500 rounded-sm text-neutral-100"
										>
											experiences@veesurve.com <br /> (or click on the link)
										</a>
									</p>
								</div>
								<div className="flex flex-row justify-center items-center gap-1">
									<Button className="group border hover:border-neutral-900 rounded-full font-semibold text-md hover:bg-neutral-100 bg-neutral-900 text-white border-white p-5">
										<ImWhatsapp
											size={25}
											className="group-hover:animate-bounce transition group-hover:text-neutral-900 bg-[#44C554] rounded-full"
										/>
										<a
											href="https://wa.me/919910173131"
											target="_blank"
											className="ml-2 group-hover:text-neutral-900"
										>
											Message us on Whatsapp
										</a>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className=" font-extrabold">
					To Explore our other services please Click on the below link
				</div>
				<div>
					<div className="flex flex-col items-center justify-center gap-1">
						<Button
							onClick={() => router.push("/holidays")}
							className="group border hover:border-neutral-900 rounded-full font-semibold text-md hover:bg-neutral-100 bg-neutral-900 text-white border-white p-2"
							size="default"
							variant="outline"
						>
							<p className="mr-2">Explore Holidays</p>

							<FaArrowAltCircleRight
								size={25}
								className="group-hover:animate-spin transition  "
							/>
						</Button>
						<Button
							onClick={() => router.push("/events")}
							className="group border hover:border-neutral-900 rounded-full font-semibold text-md hover:bg-neutral-100 bg-neutral-900 text-white border-white p-2"
							size="default"
							variant="outline"
						>
							<FaArrowAltCircleLeft
								size={25}
								className="group-hover:animate-spin transition  "
							/>
							<p className="ml-2">Explore Events</p>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContactPage;
