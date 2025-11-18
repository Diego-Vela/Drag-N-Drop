import React, { createContext, useContext, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { getSound } from '../utils/sound-manager';

type SoundKey = 'dragStart' | 'unitMove' | 'duck' | 'wow' | 'baka';

type SoundContextType = {
	playSound: (key: SoundKey) => void;
};

const SoundContext = createContext<SoundContextType>({
	playSound: () => {},
});

export const useSound = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const playersRef = useRef<Record<SoundKey, ReturnType<typeof createAudioPlayer> | null>>({
		dragStart: null,
		unitMove: null,
		duck: null,
		wow: null,
		baka: null,
	});

	useEffect(() => {
		async function preloadSounds() {
			await setAudioModeAsync({
				playsInSilentMode: true,
				shouldPlayInBackground: true,
				interruptionModeAndroid: 'duckOthers',
				interruptionMode: 'mixWithOthers',
			});
			for (const key of Object.keys(playersRef.current) as SoundKey[]) {
				const soundFile = await getSound(key);
				if (soundFile) {
					playersRef.current[key] = createAudioPlayer(soundFile);
				}
			}
		}
		preloadSounds();
	}, []);

	const playSound = (key: SoundKey) => {
		const player = playersRef.current[key];
		if (player && player.isLoaded) {
			player.seekTo(0);
			player.play();
		}
	};

	return (
		<SoundContext.Provider value={{ playSound }}>
			{children}
		</SoundContext.Provider>
	);
};
