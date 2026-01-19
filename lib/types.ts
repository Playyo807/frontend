type id = string;

type ServiceProps = {
  id: id;
  name: string;
  price: number;
  duration: number;
  keyword: string;
  imagePath: string;
};

type bookingData = {
  startedBooking: boolean;
  selectedServices: [id, string][];
  barberId: id | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
};

type BarberProps = {
  id: id;
  displayName: string;
  timeInterval: number;
  bio: string;
  userId: string;
  imageLink: string;
};

type AllowedServicesProps = {
  barberId: string;
  allowedServices: ServiceProps[];
};

type BookingDayProps = {
  id: id;
  barber_id: id;
  booking_date: string;
  booking_status: number;
  booking_date_comment: string | null;
};

type BookingTimeProps = {
  id: id;
  booking_time: string;
  barber_id: number;
  booking_day_id: number;
  booking_status: number;
};

type CountryData = {
  countryCode: string;
  name: string;
};

type User = {
  id?: id;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
};