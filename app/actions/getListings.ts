
import prisma from '@/app/libs/prismadb'
import { SafeListings } from '../types'

export default async function getListings() {
 try {
  const listings =await prisma.listing.findMany({
   orderBy:{
    price:'asc'
   }
  })

  const safeListings:any= listings.map((listing)=>({
   ...listing,
   createdAt:listing.createdAt.toISOString()
  }))

  return safeListings

 } catch (error:any) {
  throw new Error(error)
 }
}