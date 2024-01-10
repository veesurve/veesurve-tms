import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import LisitingClient from "./ListingClient";


interface IParams{
 listingId?:string
}


const LisitingPage = async ({params}:{params:IParams}) => {

 const listing= await getListingById(params)
 const currentUser =await getCurrentUser()

if(!listing){
 return<EmptyState />
}
 return (
 <LisitingClient
 currentUser={currentUser}
 listing={listing}
 
 />
  );
};

export default LisitingPage;
