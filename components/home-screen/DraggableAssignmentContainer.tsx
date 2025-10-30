// Base Imports
import React, { useState } from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { AssignmentContainer } from './AssignmentContainer';
import { Unit } from '../../contexts';

interface DraggableAssignmentContainerProps {
  title: string;
  subtitle: string;
  units: Unit[];
  isDark: boolean;
  isUnassigned?: boolean;
}

export function DraggableAssignmentContainer({
  title,
  subtitle,
  units,
  isDark,
  isUnassigned = false,
}: DraggableAssignmentContainerProps) {
  const [data, setData] = useState(units);

  // Render each draggable unit as a small "sub-container"
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Unit>) => (
    <AssignmentContainer
      title={title}
      subtitle={subtitle}
      units={[item]}
      isDark={isDark}
      isUnassigned={isUnassigned}
    />
  );

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)} 
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      scrollEnabled={false}
      activationDistance={10}
      contentContainerStyle={{
        paddingBottom: 8,
      }}
    />
  );
}
