export interface Customer {
  id: string; 
  name: string;
}

export interface Location {
  id: string;
  customer_id: string; 
  name: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Assignment {
  unit_id: string;
  location_id: string;
}

export interface CustomerLocation {
  customer_id: string;
  customer_name: string;
  location_id: string;
  location_name: string;
}

export interface AssignmentObject {
  customer: Customer;
  location: Location;
  units: Unit[];
}

export interface Note {
  id: string;
  unit_id: string;
  location_id: string;
  note: string;
}
