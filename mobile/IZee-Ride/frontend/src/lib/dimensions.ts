import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 390;  // design width (approx iPhone 14 / common Android dp 392x800)
const guidelineBaseHeight = 844;

export const scale = (size: number) => width / guidelineBaseWidth * size;
export const vscale = (size: number) => height / guidelineBaseHeight * size;
export const ms = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
export const WIDTH = width;
export const HEIGHT = height;
