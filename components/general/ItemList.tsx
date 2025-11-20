import React from 'react';
import { View, Text, SectionList } from 'react-native';

//#region Types
export type ListElement = {
  label: string;
  sublabel: string;
};

export type ListGroup = {
  key: string;
  label: string;           
  elements: ListElement[]; 
};

export type Props = {
  isDark: boolean;
  elements: ListGroup[]; 
}


export function ItemList({isDark, elements}: Props) {
  //#region Test Data
  const data: ListGroup[] = elements;

  //#region Components
  const renderSectionHeader = ({ section }: any) => (
    <View className={`${isDark ? 'bg-dark-warning' : 'bg-light-accent'} p-4`}>
      <Text className={`font-bold text-lg ${isDark ? 'text-black' : 'text-white'}`}>{section.label}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: ListElement }) => (
    <View className={`p-4 border border-dark-border ${isDark ? 'bg-dark-warning/20' : 'bg-white'}`}>
      <Text className={`text-md font-bold ${isDark ? 'text-dark-highlight-text' :'text-black'}`}>{item.label}</Text>
      {item.sublabel !== '' ? (
        <Text className={`text-md  ${isDark ? 'text-dark-highlight-text/50' :'text-gray-500'}`}>{item.sublabel}</Text>
      ) : (
        <></>
      )}
      
    </View>
  );
  //#region Render
  return (
    <View className={`overflow-hidden border-dark-border`}>
      <SectionList
        sections={data.map((group) => ({
          label: group.label,
          data: group.elements,
        }))}
        keyExtractor={(item, index) => item.label + index}
        renderItem={renderItem}
        //renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false} 
        showsVerticalScrollIndicator={false} 
      />
    </View>
  );
}
