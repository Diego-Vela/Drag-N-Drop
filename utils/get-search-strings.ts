interface HasName {
  name: string;
}

export function getSearchStrings<T extends { customer?: HasName; location?: HasName; units?: HasName[] }>(item: T) {
  return [
    item.customer?.name,
    item.location?.name,
    ...(item.units?.map(u => u.name) || [])
  ].filter(Boolean).join(' ');
}