export const getSearchResultIcon = (type: string): string => {
  switch (type) {
    case 'unit': return '📦';
    case 'location': return '📍';
    case 'customer': return '👤';
    default: return '🔍';
  }
};

export const getSearchResultTypeColor = (type: string, isDark: boolean) => {
  const colors: Record<string, { bg: string; text: string }> = {
    unit: {
      bg: isDark ? '#FCD34D20' : '#FEF3C720',
      text: isDark ? '#F59E0B' : '#D97706'
    },
    location: {
      bg: isDark ? '#3B82F620' : '#DBEAFE',
      text: isDark ? '#60A5FA' : '#1D4ED8'
    },
    customer: {
      bg: isDark ? '#10B98120' : '#D1FAE5',
      text: isDark ? '#34D399' : '#059669'
    }
  };
  
  return colors[type] || colors.unit;
};