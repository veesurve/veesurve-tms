import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import TripsClient from "./TripsClient";


const TripsPage = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return <EmptyState title="Unauthorised" subtitle="Please Login" />;}

  const reservations = await getReservations({ userId: currentUser.id });

  if(reservations.length===0){
   return<EmptyState title="No Trips Found" subtitle="You haven&apos;t reserved a trip yet" />
  }

  return(
   <TripsClient
   reservations={reservations}
   currentUser={currentUser}
   
   />
  )
};

export default TripsPage
