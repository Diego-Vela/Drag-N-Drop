import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../contexts';
import { RootStackParamList } from '../../App';
import { ThemeToggle } from './ThemeToggle';

const TAB_SCREENS = [
	{ name: 'Home', label: 'Home', icon: 'home' },
	{ name: 'Customers', label: 'Customers', icon: 'people' },
	{ name: 'Units', label: 'Units', icon: 'build-outline' },
	{ name: 'Settings', label: 'Settings', icon: 'settings' },
];

export function Hamburger() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [open, setOpen] = useState(false);
  const { isDark } = useTheme();

	return (
		<View className="relative flex">
			<TouchableOpacity
				onPress={() => setOpen((prev) => !prev)}
				className={`p-2 ${isDark ? 'bg-dark-border' : 'bg-neutral-100'} rounded-lg shadow`}
			>
				<Ionicons name="menu" size={32} color={isDark ? '#ffffffff' :'#374151' } />
			</TouchableOpacity>
			{open && (
				<View className={`absolute right-0 top-full ${isDark ? 'bg-dark-border' : 'bg-neutral-100'} rounded-lg py-2 shadow-lg z-50 w-48`}>
					{TAB_SCREENS.map((tab) => (
						<TouchableOpacity
							key={tab.name}
							className="flex-row items-center py-2 px-4"
							onPress={() => {
								setOpen(false);
								navigation.navigate(tab.name as any);
							}}
						>
							<Ionicons name={tab.icon as any} size={22} color={isDark? "#ffffff" : "#374151"} style={{ marginRight: 8 }} />
							<Text className={`text-base ${ isDark? "text-white" :"text-neutral-700"}`}>{tab.label}</Text>
						</TouchableOpacity>
					))}
					<View className={`flex-1 justify-center items-center py-2 mx-2 ${isDark ? 'bg-black/80': 'bg-light-highlight-text'} rounded-lg`}>
						<ThemeToggle/>
					</View>
					
				</View>
			)}
		</View>
	);
}