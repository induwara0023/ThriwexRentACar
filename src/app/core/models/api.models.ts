export interface Vehicle {
  id: number;
  plate_no: string;
  model: string;
  type: 'Car' | 'Van' | 'SUV';
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
