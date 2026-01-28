import { Prisma, Service } from "@/prisma/generated/prisma/client";

export type id = string;

export type UserBookings = Prisma.BookingGetPayload<{
  include: {
    services: {
      include: {
        service: true;
      };
    };
    barber: {
      include: {
        user: true;
      };
    };
    coupon: true;
    plan: {
      include: {
        plan: true;
      };
    };
  };
}>;

export type getBarberBookingsForDayType_ = Prisma.BookingGetPayload<{
  include: {
    user: true;
    services: {
      include: {
        service: true;
      };
    };
    barber: {
      include: {
        user: true;
      };
    };
    coupon: true;
    plan: {
      include: {
        plan: true;
      };
    };
  };
}>;

export type barberUser_ = {
  barberProfile: {
    id: string;
    displayName: string;
    userId: string;
    createdAt: Date;
    bio: string | null;
    timeInterval: number;
  } | null;
} | null;

export type bookings_ = Prisma.UserGetPayload<{
  include: {
    pointSystem: {
      include: {
        coupons: true;
        pointTransactions: true;
      };
    };
    bookings: {
      include: {
        services: { include: { service: true } };
        coupon: true;
        plan: {
          include: {
            plan: true;
          };
        };
      };
    };
  };
}>;


export type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  role: string;
  _count: {
    bookings: number;
  };
}

export type Plan = {
  id: string;
  name: string;
  price: number;
  keyword: string;
  description: string | null;
  planToService: Array<{
    service: Service;
  }>;
  clientPlans: Array<{
    id: string;
    useAmount: number;
    starts: Date;
    expires: Date;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }>;
}

export type TimeSlot = {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}


export type TimeSlotBA = {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export type DayAvailability = {
  date: string;
  status: "available" | "partial" | "full" | "past";
  availableSlots: number;
  totalSlots: number;
}

export type TimeSlotResponse = {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    services: {
      include: {
        service: true;
      };
    };
    barber: {
      include: {
        user: true;
      };
    };
    coupon: true;
    plan: {
      include: {
        plan: true;
      };
    };
  };
}>;

export type BookingDataSearchParams = {
  startedBooking: boolean;
  selectedServices: [id, string][];
  barberId: id | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
};