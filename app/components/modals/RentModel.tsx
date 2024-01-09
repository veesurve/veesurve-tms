"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRentModal from "@/app/hooks/useRentModel";
import Modal from "./Modal";

import { useMemo, useState } from "react";
import Heading from "@/app/components/Heading";
import { catagories } from "@/app/components/navbar/Catagories";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CountrySelect from "@/app/components/inputs/CountrySelect";

import dynamic from "next/dynamic";
import Counter from "@/app/components/inputs/Counter";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	INFO = 3,
	IMAGES = 2,
	DESCRIPTION = 4,
	PRICE = 5,
}

const RentModal = () => {
	const router = useRouter();
	const rentModal = useRentModal();
	const [step, setStep] = useState(STEPS.CATEGORY);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<FieldValues>({
		defaultValues: {
			// packageName: "",
			// destination: "",
			// citiesCovered: null,

			packageName: "",
			destination: "",
			citiesCovered: "",
			departureCity: "",
			nights: 1,
			days: 1,
			flights: false,
			visaRequired: false,
			hotelStar: 1,
			breakfast: false,
			lunch: false,
			dinner: false,
			sightseeing: false,
			transfers: false,
			price: 1,
			emi: false,
			emiMonths: 1,

			keyHighlights: "",
			itenary: "",
			inclusions: "",
			exclusions: "",
			tnc: "",
			imageSrc: "",
			createdAt: "",
			catagory: "",
			locationValue: "",
			userId: "",
		},
	});

	const category = watch("category");
	const destination = watch("destination");
	const nights = watch("nights");
	const days = watch("days");
	const imageSrc = watch("imageSrc");

	const Map = useMemo(
		() => dynamic(() => import("@/app/components/Map"), { ssr: false }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[destination]
	);
	const setCustomValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};
	const onBack = () => {
		setStep((value) => value - 1);
	};
	const onNext = () => {
		setStep((value) => value + 1);
	};

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		if (step !== STEPS.PRICE) {
			return onNext();
		}

		setIsLoading(true);
		axios
			.post("/api/listings", data)
			.then(() => {
				toast.success("Lisiting Created");
				router.refresh();
				reset();
				setStep(STEPS.CATEGORY);
				rentModal.onClose();
			})
			.catch(() => {
				toast.error("something went wrong");
				// console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const actionLabel = useMemo(() => {
		if (step === STEPS.PRICE) {
			return "Create";
		}
		return "Next";
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.CATEGORY) {
			return undefined;
		}
		return "Back";
	}, [step]);

	let bodyContent = (
		<div className="flex flex-col gap-5">
			<Heading
				title="what describe the best Category for vacation"
				subtitle="Pick a category"
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
				{catagories.map((item) => (
					<div key={item.label} className="col-span-1">
						<CategoryInput
							onClick={(category) => setCustomValue("category", category)}
							selected={category === item.label}
							label={item.label}
							icon={item.icon}
						/>
					</div>
				))}
			</div>
		</div>
	);

	if (step === STEPS.LOCATION) {
		bodyContent = (
			<div className="flex flex-col gap-5">
				<Heading
					title="Where is the Destination"
					subtitle="Choose Destination"
				/>
				<CountrySelect
					value={destination}
					onChange={(value) => setCustomValue("destination", value)}
				/>
				<Map center={destination?.latlng} />
			</div>
		);
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-3">
				<Heading title="some basics about the vacation" subtitle="usps" />
				<Counter
					title="number of night"
					subtitle="Nights"
					value={nights}
					onChange={(value) => setCustomValue("nights", value)}
				/>
				<hr />
				<Counter
					title="number of days"
					subtitle="days"
					value={days}
					onChange={(value) => setCustomValue("days", value)}
				/>
				<hr />
				<div className="flex flex-row items-center justify-evenly gap-2">
					<div className="">
						<label>Hotel Star Rating: </label>
						<select {...register("hotelStar", { required: true })}>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</div>
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Flights</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("flights", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("flights", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Visa Required</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("visaRequired", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("visaRequired", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
				</div>
				<hr />
				<div className="flex flex-row items-center justify-evenly gap-2">
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Breakfast?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("breakfast", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("breakfast", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Lunch?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("lunch", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("lunch", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Dinner?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("dinner", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("dinner", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
				</div>
				<hr />
				<div className="flex flex-row items-center justify-evenly gap-2">
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Sight Seeing?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("sightseeing", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("sightseeing", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Transfers?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("transfers", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("transfers", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}
				</div>
			</div>
		);
	}

	if (step === STEPS.IMAGES) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="images of the package" subtitle="add images" />
				<ImageUpload
					value={imageSrc}
					onChange={(value) => setCustomValue("imageSrc", value)}
				/>
			</div>
		);
	}

	if (step === STEPS.DESCRIPTION) {
		bodyContent = (
			<div className="flex flex-col gap-3">
				<Heading title="package name" subtitle="package name" />
				<div className=" flex flex-row gap-1 ">
					<Input
						id="packageName"
						label="packageName"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
					{/* <Input
						id="destination"
						label="destination"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/> */}
				</div>
				<hr />
				<div className=" flex flex-row gap-1 ">
					<Input
						id="departureCity"
						label="departureCity"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>

					<Input
						id="citiesCovered"
						label="citiesCovered"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
				</div>

				<hr />
				<div className=" flex flex-row gap-1 ">
					<Input
						id="keyHighlights"
						label="keyHighlights"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>

					<Input
						id="itenary"
						label="itenary"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
				</div>
				<hr />
				<div className=" flex flex-col gap-1 ">
					<Input
						id="inclusions"
						label="inclusions"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
					<Input
						id="exclusions"
						label="exclusions"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>

					<Input
						id="tnc"
						label="tnc"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
				</div>
			</div>
		);
	}
	if (step === STEPS.PRICE) {
		bodyContent = (
			<div className=" flex flex-col gap-5">
				<Heading title="price" subtitle="price" />
				<Input
					id="price"
					label="price"
					formatPrice
					type="number"
					disabled={isLoading}
					register={register}
					errors={errors}
					required
				/>

				<div className="flex flex-row items-center justify-evenly gap-2">
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>EMI Options?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("emi", { required: true })}
								type="radio"
								value={"true"}
							/>
							<label>No</label>
							<input
								{...register("emi", { required: true })}
								type="radio"
								value="false"
							/>
						</div>
					</div>
					{/*END yes no input filds */}

					<div className="">
						<label>Emi Months : </label>
						<select {...register("emiMonths")}>
							<option value={1}>1</option>
							<option value={3}>3</option>
							<option value={6}>6</option>
							<option value={9}>9</option>
							<option value={12}>12</option>
						</select>
					</div>
				</div>
			</div>
		);
	}
	return (
		<Modal
			title="Explore"
			onClose={rentModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			isOpen={rentModal.isOpen}
			actionLabel={actionLabel}
			body={bodyContent}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
		/>
	);
};

export default RentModal;
