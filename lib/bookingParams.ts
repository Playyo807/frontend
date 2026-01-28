import { ReadonlyURLSearchParams } from 'next/navigation';
import * as types from "@/lib/types"

type id = string;

export function encodeBookingData(data: Partial<types.BookingDataSearchParams>): URLSearchParams {
  const params = new URLSearchParams();
  
  if (data.startedBooking !== undefined) {
    params.set('started', data.startedBooking.toString());
  }
  
  if (data.selectedServices && data.selectedServices.length > 0) {
    params.set('services', JSON.stringify(data.selectedServices));
  }
  
  if (data.barberId !== null && data.barberId !== undefined) {
    params.set('barber', data.barberId.toString());
  }
  
  if (data.appointmentDate) {
    params.set('date', data.appointmentDate);
  }
  
  if (data.appointmentTime) {
    params.set('time', data.appointmentTime);
  }
  
  return params;
}

export function decodeBookingData(
  searchParams: ReadonlyURLSearchParams | { [key: string]: string | string[] | undefined }
): types.BookingDataSearchParams {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const servicesParam = get('services');
  let selectedServices: [id, string][] = [];
  
  if (servicesParam) {
    try {
      const parsed = JSON.parse(servicesParam);
      // Validate it's an array of tuples
      if (Array.isArray(parsed)) {
        selectedServices = parsed;
      }
    } catch (e) {
      console.error('Failed to parse services:', e);
      console.error('Services param value:', servicesParam);
    }
  }

  const barberParam = get('barber');

  return {
    startedBooking: get('started') === 'true',
    selectedServices,
    barberId: barberParam || null,
    appointmentDate: get('date') || null,
    appointmentTime: get('time') || null,
  };
}