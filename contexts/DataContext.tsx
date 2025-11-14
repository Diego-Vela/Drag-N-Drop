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


import { useState, useEffect } from 'react';
import { initDatabase } from '../data/database';
import { 
  addCustomer, 
  addLocation, 
  addUnit, 
  addAssignment,
  addNote, 
  
  getCustomers, 
  getLocations, 
  getUnits, 
  getAssignments,
  getCustomerLocations, 

  getUnitByName,
  getLocationByName,
  
  addCustomerLocationPair,
  saveAssignments, 
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
  addNote: (unit_id: string, location_id: string, note: string) => Promise<boolean>;
  addCustomerLocationPair: (customerName: string, locationName: string) => Promise<boolean>;

  getCustomers: () => Promise<Customer[]>;
  getLocations: () => Promise<Location[]>;
  getUnits: () => Promise<Unit[]>;
  getAssignments: () => Promise<Assignment[]>;
  getCustomerLocations: () => Promise<CustomerLocation[]>;
  getAssignmentObjects: () => Promise<AssignmentObject[]>;

  getUnassignedUnits: () => Unit[];

  prepareSaveAssignment: (data: any) => Promise<boolean>;
  saveAssignments: (newAssignments: Assignment[]) => Promise<boolean>;

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
      //console.log(`dbCustomers = ${dbCustomers}`);
      const dbLocations = await getLocations();
      //console.log(`dbLocations = ${dbLocations}`);
      const dbUnits = await getUnits();
      //console.log(`dbUnits = ${dbUnits}`);
      const dbAssignments = await getAssignments();
      //console.log(`dbAssignments = ${dbAssignments}`);
      const dbCustomerLocations = await getCustomerLocations();
      //console.log(`dbCLs = ${dbCustomerLocations}`);
      
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

  const prepareSaveAssignment = async (data: any): Promise<boolean> => {
    const preparedData: Assignment[] = [];

    for (const zone of data) {
      const location = await getLocationByName(zone.label);
      if (!location) {
        console.error(`${zone.label} was not found.`);
        return false
      }
      
      for (const unitName of zone.units) {
        const unit = await getUnitByName(unitName);
        if (!unit) {
          console.error(`${unitName} was not found`);
          return false
        }

        preparedData.push({
          unit_id: unit.id,
          location_id: location.id,
        });
      }
    }

    const success = await saveAssignments(preparedData);
    console.log(success);
    return success;
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
    addNote,
    addCustomerLocationPair,

    getCustomers,
    getLocations,
    getUnits,
    getAssignments,
    getCustomerLocations,
    getAssignmentObjects,
    
    getUnassignedUnits,
    prepareSaveAssignment,
    
    saveAssignments,
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
