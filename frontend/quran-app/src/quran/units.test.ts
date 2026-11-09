import { describe, it, expect } from 'vitest';
import { parseVerseRange, getUnitCount, getUnitBounds, getUnitVerses, getUnitForVerse } from './units';

describe('parseVerseRange', () => {

    it('reads a normal range', () => {
        expect(parseVerseRange("142-252")).toEqual({ start: 142, end: 252 });
    });

    it('reads a range that starts at 1', () => {
        expect(parseVerseRange("1-7")).toEqual({ start: 1, end: 7 });
    });

    it('returns nothing for text that is not a range', () => {
        expect(parseVerseRange("abc")).toBeUndefined();
    });

    it('returns nothing when the start is bigger than the end', () => {
        expect(parseVerseRange("7-3")).toBeUndefined();
    });

    it('returns nothing for decimal numbers', () => {
        expect(parseVerseRange("1.5-7")).toBeUndefined();
    });

    it('returns nothing when the start is missing', () => {
        expect(parseVerseRange("-5")).toBeUndefined();
    });

});

describe('getUnitCount', () => {

    it('returns 30 juz', () => {
        expect(getUnitCount("juz")).toBe(30);
    });

    it('returns 114 surahs', () => {
        expect(getUnitCount("surah")).toBe(114);
    });

    it('returns 6236 verses', () => {
        expect(getUnitCount("verse")).toBe(6236);
    });

    it('returns nothing for a unit type that is not on the list', () => {
        expect(getUnitCount("banana" as never)).toBeUndefined();
    });

});

describe('getUnitVerses', () => {

    it('juz 1 has two surah groups with 148 verses in total', () => {
        const groups = getUnitVerses("juz", 1) ?? [];
        expect(groups.length).toBe(2);
        expect(groups[0].surahNumber).toBe(1);
        expect(groups[1].surahNumber).toBe(2);
        const total = groups.reduce((sum, g) => sum + g.verses.length, 0);
        expect(total).toBe(148);
    });

    it('juz 1 starts at 1:1 and ends at 2:141', () => {
        const groups = getUnitVerses("juz", 1) ?? [];
        expect(groups[0].verses[0].verseKey).toBe("1:1");
        const last = groups[groups.length - 1].verses;
        expect(last[last.length - 1].verseKey).toBe("2:141");
    });

    it('juz 3 has surah 2 without a title, then surah 3 with a title', () => {
        const groups = getUnitVerses("juz", 3) ?? [];
        expect(groups.length).toBe(2);

        expect(groups[0].surahNumber).toBe(2);
        expect(groups[0].showTitle).toBe(false);
        expect(groups[0].verses[0].verseKey).toBe("2:253");
        expect(groups[0].verses.length).toBe(34);

        expect(groups[1].surahNumber).toBe(3);
        expect(groups[1].showTitle).toBe(true);
        expect(groups[1].verses[0].verseKey).toBe("3:1");
        expect(groups[1].verses.length).toBe(92);
    });

    it('surah 2 is one group with 286 verses and a title', () => {
        const groups = getUnitVerses("surah", 2) ?? [];
        expect(groups.length).toBe(1);
        expect(groups[0].name).toBe("Al-Baqarah");
        expect(groups[0].showTitle).toBe(true);
        expect(groups[0].verses.length).toBe(286);
    });

    it('verse 1 is one group with the verse 1:1 and a title', () => {
        const groups = getUnitVerses("verse", 1) ?? [];
        expect(groups.length).toBe(1);
        expect(groups[0].showTitle).toBe(true);
        expect(groups[0].verses[0].verseKey).toBe("1:1");
    });

    it('verse 8 is 2:1, so it gets a title', () => {
        const groups = getUnitVerses("verse", 8) ?? [];
        expect(groups[0].verses[0].verseKey).toBe("2:1");
        expect(groups[0].showTitle).toBe(true);
    });

    it('verse 262 is 2:255, so it gets no title', () => {
        const groups = getUnitVerses("verse", 262) ?? [];
        expect(groups[0].verses[0].verseKey).toBe("2:255");
        expect(groups[0].showTitle).toBe(false);
    });

    it('the verses of every juz add up to that juz\'s verse count', () => {
        for (let juz = 1; juz <= 30; juz++) {
            const groups = getUnitVerses("juz", juz) ?? [];
            const total = groups.reduce((sum, g) => sum + g.verses.length, 0);
            expect(total).toBe(getUnitBounds("juz", juz)?.verseCount);
        }
    });

    it('returns nothing for an unknown unit type', () => {
        expect(getUnitVerses("banana" as never, 1)).toBeUndefined();
    });

    it('returns nothing for a unit number out of range', () => {
        expect(getUnitVerses("juz", 31)).toBeUndefined();
    });

});

describe('getUnitForVerse', () => {

    it('finds the juz for 1:1', () => {
        expect(getUnitForVerse("juz", "1:1")).toBe(1);
    });

    it('finds the juz for 2:253, where juz 3 starts', () => {
        expect(getUnitForVerse("juz", "2:253")).toBe(3);
    });

    it('finds the juz for 2:255', () => {
        expect(getUnitForVerse("juz", "2:255")).toBe(3);
    });

    it('finds the juz for 114:6, the last verse', () => {
        expect(getUnitForVerse("juz", "114:6")).toBe(30);
    });

    it('finds the surah for 2:255', () => {
        expect(getUnitForVerse("surah", "2:255")).toBe(2);
    });

    it('finds the verse id for 1:1', () => {
        expect(getUnitForVerse("verse", "1:1")).toBe(1);
    });

    it('finds the verse id for 2:1', () => {
        expect(getUnitForVerse("verse", "2:1")).toBe(8);
    });

    it('finds the verse id for 2:255', () => {
        expect(getUnitForVerse("verse", "2:255")).toBe(262);
    });

    it('returns nothing for text that is not a verse key', () => {
        expect(getUnitForVerse("juz", "abc")).toBeUndefined();
        expect(getUnitForVerse("verse", "abc")).toBeUndefined();
    });

    it('returns nothing for a surah that does not exist', () => {
        expect(getUnitForVerse("juz", "115:1")).toBeUndefined();
    });

    it('returns nothing for an ayah of 0', () => {
        expect(getUnitForVerse("juz", "2:0")).toBeUndefined();
    });

    it('returns nothing for an unknown unit type', () => {
        expect(getUnitForVerse("banana" as never, "2:255")).toBeUndefined();
    });

    it('every verse in every juz maps back to its own juz', () => {
        for (let juz = 1; juz <= 30; juz++) {
            const groups = getUnitVerses("juz", juz) ?? [];
            for (const group of groups) {
                for (const verse of group.verses) {
                    expect(getUnitForVerse("juz", verse.verseKey)).toBe(juz);
                }
            }
        }
    });

});