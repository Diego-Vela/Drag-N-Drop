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
  customerId: number;
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
        const customerName = customersById[a.customerId]?.name || '';
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

  // Temporary Test Function
  // Group all units into unique customer/location pairs
  const getGroupedAssignments = () => {
    // Map: key = customerName__locationName, value = { customerName, locationName, units: Unit[] }
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
