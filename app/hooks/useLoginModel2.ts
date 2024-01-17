import { create } from "zustand";

interface LoginModal2Store {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useLoginModal2 = create<LoginModal2Store>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useLoginModal2;
