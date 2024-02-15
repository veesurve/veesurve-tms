import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

export const ContactUs = () => {
	const form = useRef();

	const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		emailjs
			.sendForm(
				process.env.EMAILJS_SERVICE_ID!,
				"template_cjfne2b",
				form?.current,
				{
					publicKey: "YOUR_PUBLIC_KEY",
				}
			)
			.then(
				() => {
					console.log("SUCCESS!");
				},
				(error) => {
					console.log("FAILED...", error.text);
				}
			);
	};

	return (
		<form ref:HTMLFormElement={form} onSubmit:HTMLFormElement={sendEmail}>
			<label>Name</label>
			<input type="text" name="user_name" />
			<label>Email</label>
			<input type="email" name="user_email" />
			<label>Message</label>
			<textarea name="message" />
			<input type="submit" value="Send" />
		</form>
	);
};
