import { DropZoneData } from '../types';

export const findTargetZoneId = (
    position: { x: number; y: number },
    zoneInfo: Record<string, { left: number; right: number; top: number; bottom: number }>,
  ): string | null => {
    for (const [zoneId, { left, right, top, bottom }] of Object.entries(zoneInfo)) {
      const inside =
        position.x >= left &&
        position.x <= right &&
        position.y >= top &&
        position.y <= bottom;

      if (inside) return zoneId;
    }
    return null;
  };

export const findFromZoneId = (
    id: string,
    zones: DropZoneData[],
    deadZone: DropZoneData
  ): string | undefined => {
    return (
      zones.find((zone) => zone.units.includes(id))?.id ||
      (deadZone?.units.includes(id) ? deadZone.id : undefined)
    );
  };


export const moveBetweenZones = (
    id: string,
    fromZoneId: string,
    targetZoneId: string,
    setZones: Function
  ) => {
    setZones((prevZones: DropZoneData[]) =>
      prevZones.map((zone) => {
        if (zone.id === fromZoneId) {
          return { ...zone, units: zone.units.filter((u) => u !== id) };
        } else if (zone.id === targetZoneId) {
          return { ...zone, units: [...zone.units, id] };
        }
        return zone;
      })
    );
  };

export const moveToDeadZone = (id: string, fromZoneId: string, setZones: any, setDeadZone: any, deadZone: DropZoneData) => {
    setZones((prev: DropZoneData[]) =>
      prev.map((zone) =>
        zone.id === fromZoneId
          ? { ...zone, units: zone.units.filter((unit) => unit !== id) }
          : zone
      )
    );
    setDeadZone((prev: DropZoneData) =>
      prev
        ? { ...prev, units: [...prev.units, id] }
        : { id: deadZone.id, label: deadZone.label, sublabel: deadZone.sublabel, units: [id] }
    );
  };

export const moveFromDeadZone = (
    id: string,
    targetZoneId: string,
    setZones: any,
    setDeadZone: any
  ) => {
    setDeadZone((prev: DropZoneData) =>
      prev ? { ...prev, units: prev.units.filter((u) => u !== id) } : prev
    );
    setZones((prev: DropZoneData[]) =>
      prev.map((zone) =>
        zone.id === targetZoneId
          ? { ...zone, units: [...zone.units, id] }
          : zone
      )
    );
  };
