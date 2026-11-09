import { create } from 'zustand'
import { unitTypes, UnitType } from '../quran/units';


/*
Zustand store for home page, keeping track of what modes are set for quran display. 
    
      Display Modes:
      - Mushaf: Displays the Quranic text in its original Arabic script.
      - Translation Under Unit: Shows the translation of each verse directly below the corresponding Arabic text.
      - Translation Inline: Integrates the translation within the Arabic text, providing a seamless reading experience.
      - Quran Only: Focuses solely on the Quranic text without any translations or additional content.
      - Translation Only: Presents only the translation of the Quranic text, omitting the original Arabic script.


*/

const displayModes = ["mushaf", "translationUnderUnit", "translationInline", "quranOnly", "TranslationOnly"] as const;
type DisplayMode = (typeof displayModes)[number];

interface readerStore {
    unitType: UnitType,
    unitNumber: number,
    displayMode: DisplayMode,
    setUnit: (type: UnitType, unitNumber: number) => void,
    nextUnit: () => void,
    previousUnit: () => void,
    setDisplayMode: (mode: DisplayMode) => void,
  }

const unitMax: Record<UnitType, number> = {
    verse: 6236,
    hizb: 60,
    juz: 30,
    rub: 240,
    ruku: 558,
    surah: 114,
};

const useReaderStore = create<readerStore>()((set, get) => ({

    unitType: "surah",
    unitNumber: 1,
    displayMode: "quranOnly",

    setUnit: (type, unitNumber) => {
        if (!unitTypes.includes(type)) return;
        if (!Number.isInteger(unitNumber)) return;
        if (unitNumber < 1 || unitNumber > unitMax[type]) return;
        set({ unitType: type, unitNumber });
    },

    nextUnit: () => {
        const { unitType, unitNumber } = get();
        set({ unitNumber: Math.min(unitNumber + 1, unitMax[unitType]) });
    },

    previousUnit: () => {
        const { unitNumber } = get();
        set({ unitNumber: Math.max(unitNumber - 1, 1) });
    },

    setDisplayMode: (mode) => {
        if (!displayModes.includes(mode)) return;
        set({ displayMode: mode });
    },

}));

export default useReaderStore;