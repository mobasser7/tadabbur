import ayahData from '../../data/quran-metadata-ayah.json';
import juzData from '../../data/quran-metadata-juz.json';
import hizbData from '../../data/quran-metadata-hizb.json';
import rubData from '../../data/quran-metadata-rub.json';
import rukuData from '../../data/quran-metadata-ruku.json';
import surahData from '../../data/quran-metadata-surah-name.json';


export type VerseRange = { start: number; end: number };

export const unitTypes = ["verse", "hizb", "juz", "rub", "ruku", "surah"] as const;
export type UnitType = (typeof unitTypes)[number];

export type VerseItem = { ayahNumber: number; verseKey: string };

export type SurahGroup = {
    surahNumber: number;
    name: string;
    showTitle: boolean;
    verses: VerseItem[];
};

const unitData: Record<UnitType, object> = {
    verse: ayahData,
    hizb: hizbData,
    juz: juzData,
    rub: rubData,
    ruku: rukuData,
    surah: surahData,
};

// A verse range: the first and last verse numbers
export function parseVerseRange(text: string): VerseRange | undefined {

    const parts = text.split("-");

    if (parts.length !== 2) return undefined;

    const start = Number(parts[0]);
    const end = Number(parts[1]);

    if (!Number.isInteger(start) || !Number.isInteger(end)) return undefined;

    if (start < 1 || end < 1) return undefined;

    if (start > end) return undefined;

    return { start, end };

}


export function getUnitCount(unitType: UnitType): number | undefined{

    if (!unitTypes.includes(unitType)) return undefined;

    // Look up that type's data, then count its entries
    return Object.keys(unitData[unitType]).length;
}


// The shape of one unit's entry in the juz, hizb, rub, and ruku files
type UnitEntry = { first_verse_key: string; last_verse_key: string; verses_count: number };

export function getUnitBounds(unitType: UnitType, unitNumber: number):
    { firstVerseKey: string; lastVerseKey: string; verseCount: number } | undefined {

    // Get how many units of this type exist; stop if the type is unknown
    const count = getUnitCount(unitType);
    if (count === undefined) return undefined;

    // Stop if the number is not a whole number, or is outside 1 to count
    if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > count) return undefined;

    // Verse: one entry per verse, so the first and last verse are the same
    if (unitType === "verse") {
        const verse = (ayahData as Record<string, { verse_key: string }>)[String(unitNumber)];
        return { firstVerseKey: verse.verse_key, lastVerseKey: verse.verse_key, verseCount: 1 };
    }

    // Surah: build the verse keys from the surah number
    if (unitType === "surah") {
        const surah = (surahData as Record<string, { verses_count: number }>)[String(unitNumber)];
        return {
            firstVerseKey: `${unitNumber}:1`,
            lastVerseKey: `${unitNumber}:${surah.verses_count}`,
            verseCount: surah.verses_count,
        };
    }

    // Juz, hizb, rub, ruku: the file already has all three values
    const entry = (unitData[unitType] as Record<string, UnitEntry>)[String(unitNumber)];
    return {
        firstVerseKey: entry.first_verse_key,
        lastVerseKey: entry.last_verse_key,
        verseCount: entry.verses_count,
    };
}


// Looks up a surah's simple name in the surah-name file
function getSurahName(surahNumber: number): string {
    const surah = (surahData as Record<string, { name_simple: string }>)[String(surahNumber)];
    return surah.name_simple;
}

// Returns the surah groups for one unit, or nothing if the unit is not valid
export function getUnitVerses(unitType: UnitType, unitNumber: number): SurahGroup[] | undefined {
    // Check the type and number first, using getUnitBounds
    const bounds = getUnitBounds(unitType, unitNumber);
    if (bounds === undefined) return undefined;

    // Verse: one group with one verse
    if (unitType === "verse") {
        const verse = (ayahData as Record<string, { surah_number: number; ayah_number: number; verse_key: string }>)[String(unitNumber)];
        return [{
            surahNumber: verse.surah_number,
            name: getSurahName(verse.surah_number),
            showTitle: verse.ayah_number === 1,
            verses: [{ ayahNumber: verse.ayah_number, verseKey: verse.verse_key }],
        }];
    }

    // Surah: one group with every verse of the surah
    if (unitType === "surah") {
        const verses: VerseItem[] = [];
        for (let ayah = 1; ayah <= bounds.verseCount; ayah++) {
            verses.push({ ayahNumber: ayah, verseKey: `${unitNumber}:${ayah}` });
        }
        return [{
            surahNumber: unitNumber,
            name: getSurahName(unitNumber),
            showTitle: true,
            verses,
        }];
    }

    // Juz, hizb, rub, ruku: one group per surah in verse_mapping
    const entry = (unitData[unitType] as Record<string, { verse_mapping: Record<string, string> }>)[String(unitNumber)];
    const groups: SurahGroup[] = [];

    for (const surahKey of Object.keys(entry.verse_mapping)) {
        // Turn the range text, like "142-252", into numbers
        const range = parseVerseRange(entry.verse_mapping[surahKey]);
        if (range === undefined) return undefined;

        const surahNumber = Number(surahKey);
        const verses: VerseItem[] = [];

        // Add every verse in the range, in order
        for (let ayah = range.start; ayah <= range.end; ayah++) {
            verses.push({ ayahNumber: ayah, verseKey: `${surahNumber}:${ayah}` });
        }

        groups.push({
            surahNumber,
            name: getSurahName(surahNumber),
            showTitle: range.start === 1,
            verses,
        });
    }

    return groups;
}


// Returns the unit number that contains this verse, or nothing if it can't be found
export function getUnitForVerse(unitType: UnitType, verseKey: string): number | undefined {
    // Stop if the unit type is not on the list
    if (!unitTypes.includes(unitType)) return undefined;

    // Split "2:255" into the surah number and the ayah number
    const parts = verseKey.split(":");
    if (parts.length !== 2) return undefined;
    const surahNumber = Number(parts[0]);
    const ayahNumber = Number(parts[1]);

    // Stop if either part is not a whole number
    if (!Number.isInteger(surahNumber) || !Number.isInteger(ayahNumber)) return undefined;

    // Stop if the surah doesn't exist, or the ayah is outside that surah
    const surahs = surahData as Record<string, { verses_count: number }>;
    const surah = surahs[String(surahNumber)];
    if (surah === undefined) return undefined;
    if (ayahNumber < 1 || ayahNumber > surah.verses_count) return undefined;

    // Surah: the surah number is the unit number
    if (unitType === "surah") return surahNumber;

    // Verse: add up the verses in every earlier surah, then add this ayah
    if (unitType === "verse") {
        let verseId = ayahNumber;
        for (let s = 1; s < surahNumber; s++) {
            verseId += surahs[String(s)].verses_count;
        }
        return verseId;
    }

    // Juz, hizb, rub, ruku: check each unit until one contains the verse
    const normalizedKey = `${surahNumber}:${ayahNumber}`;
    const count = getUnitCount(unitType) ?? 0;

    for (let unit = 1; unit <= count; unit++) {
        const groups = getUnitVerses(unitType, unit) ?? [];
        const found = groups.some((group) =>
            group.verses.some((verse) => verse.verseKey === normalizedKey)
        );
        if (found) return unit;
    }

    return undefined;
}

