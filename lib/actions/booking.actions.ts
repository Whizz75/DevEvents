'use server';

import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";

export const createBooking = async ({ event, slug, email }: { event: string, slug: string, email: string; }) => {
  try {
    await connectDB();
    
    await Booking.create({ event, slug, email });
    
    return { success: true };
    
  } catch (e) {
    console.error('Create Booking Failed', e);
    return { success: false };
  }
}