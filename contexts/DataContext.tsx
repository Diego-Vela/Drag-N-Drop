import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import testData from '../test-files/test-data.json';

export interface Customer {
  id: number;
  name: string;
}

export interface Location {
  id: string;
  customerId: number;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Assignment {
  unitId: string;
  locationId: string;
}

export interface DataContextType {
  customers: Customer[];
  locations: Location[];
  units: Unit[];
  assignments: Assignment[];
  customersById: Record<number, Customer>;
  locationsById: Record<string, Location>;
  unitsById: Record<string, Unit>;
  getAssignmentsForLocation: (locationId: string) => [string, string, string][];
  getUnitsForLocation: (locationId: string) => Unit[];
  getUnassignedUnits: () => Unit[];
  getGroupedAssignments: () => { customerName: string; locationName: string; units: Unit[] }[];
  getUnassignedCustomerLocations: () => { customerName: string; locationName: string }[];
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const customersById = useMemo(() => {
    const map: Record<number, Customer> = {};
    testData.customers.forEach((customer: Customer) => {
      map[customer.id] = customer;
    });
    return map;
  }, []);

  const locationsById = useMemo(() => {
    const map: Record<string, Location> = {};
    testData.locations.forEach((location: Location) => {
      map[location.id] = location;
    });
    return map;
  }, []);

  const unitsById = useMemo(() => {
    const map: Record<string, Unit> = {};
    testData.units.forEach((unit: Unit) => {
      map[unit.id] = unit;
    });
    return map;
  }, []);

  const getAssignmentsForLocation = (locationId: string): [string, string, string][] =>
    testData.assignments
      .filter((a: Assignment) => a.locationId === locationId)
      .map((a: Assignment) => {
        const unitName = unitsById[a.unitId]?.name || '';
        const locationName = locationsById[a.locationId]?.name || '';
        const customerId = locationsById[a.locationId]?.customerId;
        const customerName = customerId ? customersById[customerId]?.name || '' : '';
        return [unitName, locationName, customerName];
      });

  const getUnitsForLocation = (locationId: string): Unit[] =>
    testData.assignments
      .filter((a: Assignment) => a.locationId === locationId)
      .map((a: Assignment) => unitsById[a.unitId])
      .filter(Boolean);

  const getUnassignedUnits = (): Unit[] => {
    const assignedIds = new Set(testData.assignments.map((a: Assignment) => a.unitId));
    return testData.units.filter((u: Unit) => !assignedIds.has(u.id));
  };

  // Group all units into unique customer/location pairs
  const getGroupedAssignments = () => {
    const grouped: Record<string, { customerName: string; locationName: string; units: Unit[] }> = {};
    testData.assignments.forEach((a: Assignment) => {
      const location = locationsById[a.locationId];
      if (!location) return;
      const customer = customersById[location.customerId];
      if (!customer) return;
      const unit = unitsById[a.unitId];
      if (!unit) return;
      const key = `${customer.name}__${location.name}`;
      if (!grouped[key]) {
        grouped[key] = { customerName: customer.name, locationName: location.name, units: [] };
      }
      grouped[key].units.push(unit);
    });
    return Object.values(grouped);
  };

  // Helper: Get customer/location pairs with no assignments
  const getUnassignedCustomerLocations = () => {
    // Get all location IDs that have assignments
    const assignedLocationIds = new Set(testData.assignments.map((a: Assignment) => a.locationId));
    // Filter locations with no assignments
    return testData.locations
      .filter((loc: Location) => !assignedLocationIds.has(loc.id))
      .map((loc: Location) => {
        const customer = customersById[loc.customerId];
        return {
          customerName: customer ? customer.name : '',
          locationName: loc.name,
        };
      });
  };

  const value: DataContextType = {
    customers: testData.customers,
    locations: testData.locations,
    units: testData.units,
    assignments: testData.assignments,
    customersById,
    locationsById,
    unitsById,
    getAssignmentsForLocation,
    getUnitsForLocation,
    getUnassignedUnits,
    getGroupedAssignments,
    getUnassignedCustomerLocations,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};



import { useState, useEffect } from 'react';
import { initDatabase } from '../data/database';
import { addCustomer, addLocation, addUnit, addAssignment } from 'data/database-helpers';

const NewDataContext = createContext<NewDataContextType | null>(null);

export interface NewDataContextType {
  customers: Customer[];
  locations: Location[];
  units: Unit[];
  assignments: Assignment[];
}


export const NewDataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    (async () => {
      const db = await initDatabase();
    })
  }, []);

  const value: NewDataContextType ={
    customers: customers,
    locations: locations,
    units: units,
    assignments: assignments,
  }

  return (
    <NewDataContext.Provider value={value}>
      {children}
    </NewDataContext.Provider>
  )
}
