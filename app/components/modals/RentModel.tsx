"use client";

import { FieldValues, useForm } from "react-hook-form";
import useRentModal from "@/app/hooks/useRentModel";
import Modal from "./Modal";

import { useMemo, useState } from "react";
import Heading from "@/app/components/Heading";
import { catagories } from "@/app/components/navbar/Catagories";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CountrySelect from "@/app/components/inputs/CountrySelect";
// import Map from "@/app/components/Map";
import dynamic from "next/dynamic";

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	INFO = 2,
	IMAGES = 3,
	DESCRIPTION = 4,
	PRICE = 5,
}

const RentModal = () => {
	const rentModal = useRentModal();
	const [step, setStep] = useState(STEPS.CATEGORY);

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
			citiesCovered: null,
			departureCity: "",
			nights: 1,
			days: 1,
			flights: false,
			visa_fees: false,
			hotelStar: 1,
			breakfast: false,
			lunch: false,
			dinner: false,
			sightseeing: false,
			transfers: false,
			price: 1,
			emi: false,
			emiMonths: 1,
			departureDates: "",
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
			review: "",
		},
	});

 const category=watch('category')
 const location=watch('location')

 const Map = useMemo(() => dynamic(() => import("@/app/components/Map"),{ssr:false}),[location]);
 const setCustomValue =(id:string, value:any)=>{
  setValue(id,value,{
   shouldValidate:true,
   shouldDirty:true,
   shouldTouch:true,
  })
 }
	const onBack = () => {
		setStep((value) => value - 1);
	};
	const onNext = () => {
		setStep((value) => value + 1);
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mah-h-[50vh] overflow-y-auto">
				{catagories.map((item) => (
					<div key={item.label} className="col-span-1">
						<CategoryInput
							onClick={(category) => setCustomValue('category',category)}
							selected={category=== item.label}
							label={item.label}
							icon={item.icon}
						/>
					</div>
				))}
			</div>
		</div>
	)

 if(step===STEPS.LOCATION){
  bodyContent=(
   <div className="flex flex-col gap-5">
    <Heading
    title="Where is the Destination"
    subtitle="Choose Destination"
    />
    <CountrySelect
    value={location}
     onChange={(value)=>setCustomValue('location',value)}
    />
    <Map 
    center={location?.latlng}
    />
   </div>

  )
 }

	return (
		<Modal
			title="Explore"
			onClose={rentModal.onClose}
			onSubmit={onNext}
			isOpen={rentModal.isOpen}
			actionLabel={actionLabel}
			body={bodyContent}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
		/>
	);
};

export default RentModal;
