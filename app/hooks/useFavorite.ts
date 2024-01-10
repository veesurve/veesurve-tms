import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModel";

interface iUseFavorites {
	listingId: string;
	currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: iUseFavorites) => {
	const router = useRouter();
	const loginModel = useLoginModal();

	const hasFavorited = useMemo(() => {
		const list = currentUser?.favoriteIds || [];

		return list.includes(listingId);
	}, [currentUser, listingId]);

	const toggleFavorite = useCallback(
		async (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();

			if (!currentUser) {
				return loginModel.onOpen();
			}

			try {
				let request;

				if (hasFavorited) {
					request = () => axios.delete(`/api/favorites/${listingId}`);
				} else {
					request = () => axios.post(`/api/favorites/${listingId}`);
				}

				await request();
				router.refresh();
				toast.success("Success");
			} catch (error) {
				toast.error("Something went wrong.");
			}
		},
		[currentUser, hasFavorited, listingId, loginModel, router]
	);

	return {
		hasFavorited,
		toggleFavorite,
	};
};

export default useFavorite;
