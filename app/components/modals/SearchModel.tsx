"use client";

import useSearchModal from "@/app/hooks/useSearchModel";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import { CheckboxInput } from "../inputs/CheckBoxInput";

enum STEPS {
	LOCATION = 0,
	// DATE = 1,
	INFO = 1,
}

const SearchModel = () => {
	const searchModel = useSearchModal();
	const router = useRouter();
	const params = useSearchParams();

	const [location, setLocation] = useState<CountrySelectValue>();

	const [flights, setFlights] = useState(false);
	const [step, setStep] = useState(STEPS.LOCATION);
	// const [dateRange, setDateRange] = useState<Range>({
	// 	startDate: new Date(),
	// 	endDate: new Date(),
	// 	key: "selection",
	// });

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const Map = useMemo(
		() => dynamic(() => import("../Map"), { ssr: false }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[location]
	);

	const onBack = useCallback(() => {
		setStep((value) => value - 1);
	}, []);
	const onNext = useCallback(() => {
		setStep((value) => value + 1);
	}, []);

	const onSubmit = useCallback(async () => {
		if (step !== STEPS.INFO) {
			return onNext();
		}
		let currentQuery = {};

		if (params) {
			currentQuery = qs.parse(params.toString());

			console.log(flights);

			const updatedQuery: any = {
				...currentQuery,
				locationValue: location?.value,
				flights: flights,
			};
			// if (dateRange.startDate) {
			// 	updatedQuery.startDate = formatISO(dateRange.startDate);
			// }

			// if (dateRange.endDate) {
			// 	updatedQuery.endDate = formatISO(dateRange.endDate);
			// }

			const url = qs.stringifyUrl(
				{
					url: "/holidays",
					query: updatedQuery,
				},
				{ skipNull: true }
			);
			setStep(STEPS.LOCATION);
			searchModel.onClose();

			router.push(url);
		}
	}, [step, searchModel, location, router, onNext, flights, params]);

	const actionLabel = useMemo(() => {
		if (step === STEPS.INFO) {
			return "Search";
		}

		return "Next";
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.LOCATION) {
			return undefined;
		}
		return "Back";
	}, [step]);

	let bodyContent = (
		<div className="flex flex-col gap-8">
			<Heading
				title="Where do you wnna  go?"
				subtitle="Find your perfect Location!"
			/>
			<CountrySelect
				value={location}
				onChange={(value) => setLocation(value as CountrySelectValue)}
			/>

			<hr />
			<Map center={location?.latlng} />
		</div>
	);

	// if (step === STEPS.DATE) {
	// 	bodyContent = (
	// 		<div className="flex flex-col gap-8">
	// 			<Heading
	// 				title="When do you plan to go?"
	// 				subtitle="Make sure every one is free"
	// 			/>

	// 			<Calender
	// 				value={dateRange}
	// 				onChange={(value) => setDateRange(value.selection)}
	// 			/>
	// 		</div>
	// 	);
	// }

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="More information" subtitle="find your perfect trip" />
				<CheckboxInput
					id="flight"
					title="Flights"
					subtitle="Do you want flights in the package?"
					field={flights}
					onChange={() => setFlights(!flights)}
				/>
			</div>
		);
	}

	return (
		<Modal
			isOpen={searchModel.isOpen}
			onClose={searchModel.onClose}
			onSubmit={onSubmit}
			title="Filters"
			actionLabel={actionLabel}
			body={bodyContent}
			secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
			secondaryActionLabel={secondaryActionLabel}
		/>
	);
};

export default SearchModel;
