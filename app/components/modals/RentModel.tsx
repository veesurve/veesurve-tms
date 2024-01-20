"use client";

import {
	FieldValues,
	SubmitHandler,
	useForm,
	useFieldArray,
} from "react-hook-form";
import useRentModal from "@/app/hooks/useRentModel";
import Modal from "./Modal";
// import {DevTool} from '@hookform/devtools'

import { useMemo, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
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
import NestedModal from "./NestedModal";

export interface FormProps extends FieldValues {
	packageName: string;
	description: string;
	destination: string;
	citiesCovered: string;
	departureCity: string;
	nights: number;
	days: number;
	flights?: boolean;
	visaRequired?: boolean;
	hotelStar: number;
	breakfast?: boolean;
	lunch?: boolean;
	dinner?: boolean;
	sightseeing?: boolean;
	transfers?: boolean;
	price: number;
	emi?: boolean;
	emiMonths?: number;
	keyHighlights: { highlight: string }[];
	veg?: boolean;
	nonVeg?: boolean;
	jainVeg?: boolean;
	hotel?: string;
	itinerary: {
		title: string;
		narration: { narr: string }[];
		inclusion: { incl: string }[];
	}[];
	exclusions: { excl: string }[];
	tnc: { t: string }[];
	imageSrc?: string;
	category: string;
	locationValue?: string;
	review?: string;
	rating?: number;
	userId?: string;
}

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	KEYHIGHLIGHTS = 2,
	EXCLUSIONS = 3,
	TNC = 4,
	ITINERARY = 5,
	IMAGES = 6,
	INFO = 7,
	DESCRIPTION = 8,
	PRICE = 9,
}

const RentModal: React.FC<FormProps> = () => {
	const router = useRouter();
	const rentModal = useRentModal();
	const [step, setStep] = useState(STEPS.CATEGORY);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		formState: { errors },
		reset,
	} = useForm<FormProps>({
		defaultValues: {
			packageName: "",
			destination: "",
			description: "",
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
			veg: false,
			nonVeg: false,
			jainVeg: false,
			sightseeing: false,
			transfers: false,
			price: 1,
			emi: false,
			emiMonths: 1,
			hotel: "",
			itinerary: [
				{
					title: "untitled",
					narration: [{ narr: "1" }],
					inclusion: [{ incl: "1" }],
				},
			],
			keyHighlights: [{ highlight: "1" }],

			exclusions: [{ excl: "1" }],
			tnc: [{ t: "1" }],
			imageSrc: "",

			category: "",
			locationValue: "",
			userId: "",
		},
	});

	const category = watch("category");
	const destination = watch("destination");
	const nights = watch("nights");
	const days = watch("days");
	const imageSrc = watch("imageSrc");

	const {
		fields: keyFields,
		append: keyAppend,
		remove: keyRemove,
	} = useFieldArray({
		name: "keyHighlights",
		control,
	});

	const {
		fields: exclFields,
		append: exclAppend,
		remove: exclRemove,
	} = useFieldArray({
		name: "exclusions",
		control,
	});
	const {
		fields: itineraryFields,
		append: itineraryAppend,
		remove: itineraryRemove,
	} = useFieldArray({
		name: "itinerary",
		control,
	});
	const {
		fields: tncFields,
		append: tncAppend,
		remove: tncRemove,
	} = useFieldArray({
		name: "tnc",
		control,
	});

	const Map = useMemo(
		() => dynamic(() => import("@/app/components/Map"), { ssr: false }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[destination]
	);

	const setCustomValue = (id: any, value: any) => {
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

	const onSubmit: SubmitHandler<FormProps> = (data: FormProps) => {
		if (step !== STEPS.PRICE) return onNext();

		setIsLoading(true);
		const payload = {
			...data,
			keyHighlights: data.keyHighlights.map((k) => k.highlight),
			exclusions: data.exclusions.map((k) => k.excl),
			itinerary: data.itinerary.map((i) => ({
				title: i.title,
				narration: i.narration.map((n) => n.narr),
				inclusion: i.inclusion.map((t) => t.incl),
			})),
			tnc: data.tnc.map((k) => k.t),
		};
		axios
			.post("/api/listings", payload)
			.then(() => {
				toast.success("Lisiting Created");
				router.refresh();
				reset();
				setStep(STEPS.CATEGORY);
				rentModal.onClose();
				console.log(payload);
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

	if (step === STEPS.KEYHIGHLIGHTS) {
		bodyContent = (
			<div className="flex flex-col gap-5">
				<Heading title="Enter Key Highlights" />

				<div className="flex flex-col gap-2">
					{keyFields.map((field, index) => {
						return (
							<div className="flex flex-row gap-2" key={field.id}>
								<input
									type="text"
									{...register(`keyHighlights.${index}.highlight`)}
								/>
								{index >= 0 && (
									<button onClick={() => keyRemove(index)}>
										<CiCircleMinus size={18} />
									</button>
								)}
							</div>
						);
					})}
					<button onClick={() => keyAppend({ highlight: "" })}>
						Add
						<CiCirclePlus size={18} />
					</button>
				</div>
			</div>
		);
	}

	if (step === STEPS.EXCLUSIONS) {
		bodyContent = (
			<div className="flex flex-col gap-5">
				<Heading title="Enter exclusions" />

				<div className="flex flex-col gap-2">
					{exclFields.map((field, index) => {
						return (
							<div className="flex flex-row gap-2" key={field.id}>
								<input type="text" {...register(`exclusions.${index}.excl`)} />
								{index >= 0 && (
									<button onClick={() => exclRemove(index)}>
										<CiCircleMinus size={18} />
									</button>
								)}
							</div>
						);
					})}
					<button onClick={() => exclAppend({ excl: "" })}>
						Add
						<CiCirclePlus size={18} />
					</button>
				</div>
			</div>
		);
	}

	if (step === STEPS.TNC) {
		bodyContent = (
			<div className="flex flex-col gap-5">
				<Heading title="Enter Terms & Conditon" />

				<div className="flex flex-col gap-2">
					{tncFields.map((field, index) => {
						return (
							<div className="flex flex-row gap-2" key={field.id}>
								<input type="text" {...register(`tnc.${index}.t`)} />
								{index >= 0 && (
									<button onClick={() => tncRemove(index)}>
										<CiCircleMinus size={18} />
									</button>
								)}
							</div>
						);
					})}
					<button onClick={() => tncAppend({ t: "" })}>
						Add
						<CiCirclePlus size={18} />
					</button>
				</div>
			</div>
		);
	}

	if (step === STEPS.ITINERARY) {
		bodyContent = (
			<div className="flex flex-col gap-5">
				<Heading title="Enter itinerary" />

				<div className="flex flex-col gap-2">
					{itineraryFields.map((field, index) => {
						return (
							<div className="flex flex-col gap-2" key={field.id}>
								add title
								<input type="text" {...register(`itinerary.${index}.title`)} />
								<div className="flex flex-col">
									add narrations
									<NestedModal
										parent="itinerary"
										nestIndex={index}
										control={control}
										register={register}
										nestArray="narration"
										nestKey="narr"
									/>
								</div>
								{/* {field?.map((narr, narindex) => {
									return (
										<div className="flex flex-row gap-2" key={narr.id}>
											<input
												type="text"
												{...register(`narration.${narindex}.narr`)}
											/>
										</div>
									);
								})} */}
								{/* {index >= 0 && (
									<button onClick={() => itineraryRemove(index)}>
										<CiCircleMinus size={18} />
									</button>
								)} */}
								<div className="flex flex-col">
									<NestedModal
										parent="itinerary"
										nestIndex={index}
										control={control}
										register={register}
										nestArray="inclusion"
										nestKey="incl"
									/>
								</div>
								{index > 0 && (
									<button onClick={() => itineraryRemove(index)}>
										{" "}
										remove
										<CiCircleMinus size={18} />
									</button>
								)}
							</div>
						);
					})}
					<button
						onClick={() =>
							itineraryAppend({
								title: "untitled",
								narration: [{ narr: "1" }],
								inclusion: [{ incl: "1" }],
							})
						}
					>
						Add
						<CiCirclePlus size={18} />
					</button>
				</div>
			</div>
		);
	}

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
				<Map center={destination?.latlng as const} />
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
				<div
					id="wrapper"
					className="flex flex-row items-center justify-around gap-2 "
				>
					<div
						id="first"
						className="flex flex-col items-center justify-evenly gap-2 "
					>
						<div className="flex flex-col items-center justify-evenly gap-2">
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
										{...register("flights", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("flights", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
							{/*START yes no input filds */}
							<div className="flex flex-col items-center justify-center gap-2">
								<h1>Visa Included</h1>
								<div className=" flex flex-row gap-4">
									<label>Yes</label>
									<input
										{...register("visaRequired", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("visaRequired", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
						</div>
					</div>
					<hr />
					<div id="second">
						<div className="flex flex-col items-center justify-evenly gap-2 ">
							{/*START yes no input filds */}
							<div className="flex flex-col items-center justify-center gap-2">
								<h1>Breakfast?</h1>
								<div className=" flex flex-row gap-4">
									<label>Yes</label>
									<input
										{...register("breakfast", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("breakfast", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
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
										{...register("lunch", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("lunch", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
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
										{...register("dinner", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("dinner", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
						</div>
					</div>

					<div id="third">
						<div className="flex flex-col items-center justify-evenly gap-2 ">
							{/*START yes no input filds */}
							<div className="flex flex-col items-center justify-center gap-2">
								<h1>Vegitarian?</h1>
								<div className=" flex flex-row gap-4">
									<label>Yes</label>
									<input
										{...register("veg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("veg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
							{/*START yes no input filds */}
							<div className="flex flex-col items-center justify-center gap-2">
								<h1>Non-Vegitarian?</h1>
								<div className=" flex flex-row gap-4">
									<label>Yes</label>
									<input
										{...register("nonVeg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("nonVeg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
							{/*START yes no input filds */}
							<div className="flex flex-col items-center justify-center gap-2">
								<h1>Jain-Vegitarian?</h1>
								<div className=" flex flex-row gap-4">
									<label>Yes</label>
									<input
										{...register("jainVeg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="true"
									/>
									<label>No</label>
									<input
										{...register("jainVeg", {
											required: true,
											setValueAs: (value: string) =>
												value === "true"
													? true || value === "false"
													: false || value,
										})}
										type="radio"
										value="false"
									/>
								</div>
							</div>
							{/*END yes no input filds */}
						</div>
					</div>
				</div>
				<hr />
				<div className="flex flex-row items-center justify-evenly gap-2">
					{/*START yes no input filds */}
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Sight Seeing?</h1>
						<div className=" flex flex-row gap-4">
							<label>Yes</label>
							<input
								{...register("sightseeing", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
								type="radio"
								value="true"
							/>
							<label>No</label>
							<input
								{...register("sightseeing", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
								type="radio"
								value="{false}"
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
								{...register("transfers", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
								type="radio"
								value="true"
							/>
							<label>No</label>
							<input
								{...register("transfers", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
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
				</div>
				<hr />
				<div className=" flex flex-col gap-1 ">
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
					<Input
						id="hotel"
						label="Hotel"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
				</div>

				<hr />
				<div className=" flex flex-row gap-1 ">
					<Input
						id="description"
						label="description"
						disabled={isLoading}
						register={register}
						errors={errors}
						required
					/>
				</div>
				<hr />
				<div
					className=" flex flex-c
				ol gap-1 "
				></div>
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
								{...register("emi", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
								type="radio"
								value="true"
							/>
							<label>No</label>
							<input
								{...register("emi", {
									required: true,
									setValueAs: (value: string) =>
										value === "true"
											? true || value === "false"
											: false || value,
								})}
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
		// <DevTool />
	);
};

export default RentModal;
