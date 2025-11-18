import { createAudioPlayer } from "expo-audio";

const sounds = {
  dragStart: require('../assets/sounds/drag-start.mp3'),
  unitMove: require('../assets/sounds/unit-move.mp3'),
  duck: require('../assets/sounds/donald-duck-troll-sound.mp3'),
  wow: require('../assets/sounds/wow.mp3'),
  baka: require('../assets/sounds/baka-oneechan.mp3'),
};

export function getSound(key: keyof typeof sounds): any | boolean {
  const soundFile = sounds[key];
  if (!soundFile) return false;
  return soundFile;
}

export function playSoundAndroid(key: keyof typeof sounds, callback?: () => void) {
  const player = createAudioPlayer(getSound(key));
  if (!player) return false;
  player.seekTo(0);
  player.play();

  if (typeof player.duration === 'number' && callback) {
    setTimeout(callback, player.duration * 1000);
  }
}