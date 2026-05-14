export interface Vehicle {
  id: number;
  plate_no: string;
  model: string;
  service_type: 'rent' | 'hire';
  type: 'Car' | 'Van' | 'SUV' | 'Bike';
  transmission: 'Auto' | 'Manual';
  current_km: number;
  next_service_km: number;
  insurance_expiry: string;
  license_expiry: string;
  status: 'available' | 'rented' | 'maintenance';
  daily_rate: number;
  km_limit_per_day: number;
  extra_km_rate: number;
  image_path: string;
  image_url?: string;
}

export interface Driver {
  id: number;
  name: string;
  license_no: string;
  phone: string;
  address: string;
  status: 'available' | 'on_hire' | 'inactive';
}

export interface HireBooking {
  id: number;
  vehicle_id: number;
  driver_id: number;
  customer_id: number | null;
  customer_name_manual: string;
  distance_km: number;
  rate_per_km: number;
  total_price: number;
  booking_date: string;
  destination: string;
  status: 'ongoing' | 'completed' | 'cancelled';
  vehicle?: Vehicle;
  driver?: Driver;
  customer?: Customer;
}

export interface Customer {
  id: number;
  nic_no: string;
  name: string;
  phone: string;
  address: string;
  status: 'active' | 'blacklisted';
}

export interface Media {
  id: number;
  type: 'selfie' | 'nic_front' | 'nic_back' | 'agreement' | 'security_item';
  file_url: string;
}

export interface Booking {
  id: number;
  vehicle_id: number;
  customer_id: number;
  pickup_datetime: string;
  return_datetime: string;
  pickup_km: number;
  return_km: number | null;
  advance_payment: number;
  total_price: number | null;
  security_item_description: string;
  status: 'ongoing' | 'completed';
  vehicle?: Vehicle;
  customer?: Customer;
  media?: Media[];
}
