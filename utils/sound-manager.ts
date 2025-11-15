import { createAudioPlayer } from 'expo-audio';

const sounds = {
  dragStart: require('../assets/sounds/drag-start.mp3'),
  unitMove: require('../assets/sounds/unit-move.mp3'),
  duck: require('../assets/sounds/donald-duck-troll-sound.mp3'),
  wow: require('../assets/sounds/wow.mp3'),
  baka: require('../assets/sounds/baka-oneechan.mp3'),
};

export async function playSound(key: keyof typeof sounds) {
  const soundFile = sounds[key];
  if (!soundFile) return;

  try {
    const player = createAudioPlayer(soundFile);
    player.play();
  } catch (error) {
    console.error(`Error playing sound ${key}:`, error);
  }
}
