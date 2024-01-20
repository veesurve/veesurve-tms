import React from "react";
import { useFieldArray} from "react-hook-form";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const NestedModal = ({
	parent,
	nestIndex,
	control,
	register,
	nestArray,
	nestKey,
}) => {
 const name= `${parent}.${nestIndex}.${nestArray}`
	const { fields, remove, append } = useFieldArray({
		control,
		 name,
	});
	return (
		<div>
			{fields.map((field, index) => {
				return (
					<div className="flex flex-row gap-2" key={field.id}>
						<input type="text" {...register(`${name}.${index}.${nestKey}`)} />
						{index >= 0 && (
							<button onClick={() => remove(index)}>
								<CiCircleMinus size={18} />
							</button>
						)}
					</div>
				);
			})}
			<button onClick={() => append({ [nestKey]: "" })}>
				Add
				<CiCirclePlus size={18} />
			</button>
		</div>
	);
};

export default NestedModal;
