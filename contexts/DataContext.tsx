import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import testData from '../test-files/test-data.json';

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
  customer: string;
  location: string;
  units: Unit[];
}

export interface DataContextType {
  customers: Customer[];
  locations: Location[];
  units: Unit[];
  assignments: Assignment[];
  customersById: Record<string, Customer>; // changed from number → string
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
  // --- Create ID maps for faster lookup ---
  const customersById = useMemo(() => {
    const map: Record<string, Customer> = {}; // ✅ string keys
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

  // --- Derived helpers ---
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
      .filter(Boolean) as Unit[];

  const getUnassignedUnits = (): Unit[] => {
    const assignedIds = new Set(testData.assignments.map((a: Assignment) => a.unitId));
    return testData.units.filter((u: Unit) => !assignedIds.has(u.id));
  };

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

  const getUnassignedCustomerLocations = () => {
    const assignedLocationIds = new Set(testData.assignments.map((a: Assignment) => a.location_id));
    return testData.locations
      .filter((loc: Location) => !assignedLocationIds.has(loc.id))
      .map((loc: Location) => {
        const customer = customersById[loc.customer_id];
        return {
          customerName: customer ? customer.name : '',
          locationName: loc.name,
        };
      });
  };

  // --- Final Context Value ---
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
import { 
  addCustomer, 
  addLocation, 
  addUnit, 
  addAssignment, 
  
  getCustomers, 
  getLocations, 
  getUnits, 
  getAssignments,
  getCustomerLocations, 
  
  addCustomerLocationPair, 
  dropAllTables } from 'data/database-helpers';

const NewDataContext = createContext<NewDataContextType | null>(null);

export interface NewDataContextType {
  customers: Customer[];
  locations: Location[];
  units: Unit[];
  assignments: Assignment[];

  addCustomer: (id: string, name: string) => Promise<void>;
  addLocation: (id: string, location: string, customer_id: string) => Promise<boolean>;
  addUnit: ( unit: string) => Promise<boolean>;
  addAssignment: (id: string, unit_id: string, location_id: string) => Promise<boolean>;
  addCustomerLocationPair: (customerName: string, locationName: string) => Promise<boolean>;

  getCustomers: () => Promise<Customer[]>;
  getLocations: () => Promise<Location[]>;
  getUnits: () => Promise<Unit[]>;
  getAssignments: () => Promise<Assignment[]>;
  getCustomerLocations: () => Promise<CustomerLocation[]>;

  getUnassignedUnits: () => Unit[];
  getAssignmentObjects: () => Promise<AssignmentObject[]>;

  dropAllTables: () => Promise<void>;

  refetch: () => Promise<void>;
}

export const NewDataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [customerLocations, setCustomerLocations] = useState<CustomerLocation[]>([]);

  useEffect(() => {
    (async () => {
      await initDatabase();
      
      const dbCustomers = await getCustomers();
      const dbLocations = await getLocations();
      const dbUnits = await getUnits();
      const dbAssignments = await getAssignments();
      const dbCustomerLocations = await getCustomerLocations();
      
      setCustomers(dbCustomers as Customer[]);
      setLocations(dbLocations as Location[]);
      setUnits(dbUnits as Unit[]);
      setAssignments(dbAssignments as Assignment[]);
      setCustomerLocations(dbCustomerLocations as CustomerLocation[]);

      console.log('Db Connected');
    })(); 
  }, []);

  const refetch = async () => {
    const dbCustomers = await getCustomers();
    const dbLocations = await getLocations();
    const dbUnits = await getUnits();
    const dbAssignments = await getAssignments();

    setCustomers(dbCustomers as Customer[]);
    setLocations(dbLocations as Location[]);
    setUnits(dbUnits as Unit[]);
    setAssignments(dbAssignments as Assignment[]); 
  }

  const getUnassignedUnits = (): Unit[] => {
    const assignedUnitIds = new Set(assignments.map(a => a.unit_id));
    return units.filter(u => !assignedUnitIds.has(u.id));
  };

  const getAssignmentObjects = async (): Promise<AssignmentObject[]> => {
    const unitMap = new Map(units.map(unit => [unit.id, unit]));
    const locationToUnits = new Map<string, Unit[]>();

    for (const assignment of assignments) {
      const unit = unitMap.get(assignment.unit_id);
      if (!unit) continue;

      if (!locationToUnits.has(assignment.location_id)) {
        locationToUnits.set(assignment.location_id, []);
      }
      locationToUnits.get(assignment.location_id)!.push(unit);
    }

    return customerLocations.map(cl => ({
      customer: cl.customer_name,
      location: cl.location_name,
      units: locationToUnits.get(cl.location_id) || [],
    }) as AssignmentObject);

  }

  const value: NewDataContextType = {
    customers,
    locations,
    units,
    assignments,

    addCustomer,
    addLocation,
    addUnit,
    addAssignment,
    addCustomerLocationPair,

    getCustomers,
    getLocations,
    getUnits,
    getAssignments,
    getCustomerLocations,
    
    getUnassignedUnits,
    getAssignmentObjects,

    dropAllTables,

    refetch,
  };

  return (
    <NewDataContext.Provider value={value}>
      {children}
    </NewDataContext.Provider>
  );
};

export const useNewData = (): NewDataContextType => {
  const context = useContext(NewDataContext);
  if (!context) {
    throw new Error('useNewData must be used within a NewDataProvider');
  }
  return context;
};
