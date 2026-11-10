import type { SQLiteDatabase } from 'expo-sqlite';
import wordsJson from '../../data/qpc-v4.json';

// One word entry in qpc-v4.json
type WordEntry = { id: number; text: string };

// One row in the pages table
type LayoutRow = {
    line_number: number;
    line_type: string;
    first_word_id: number;
    last_word_id: number;
};

// Look up each word's glyph by its id, once, when the module loads
const wordTextById = new Map<number, string>();
for (const word of Object.values(wordsJson as Record<string, WordEntry>)) {
    wordTextById.set(word.id, word.text);
}

// Returns the lines of one Mushaf page, top to bottom, each as a list of glyphs
export function getPageLines(db: SQLiteDatabase, pageNumber: number): string[][] | undefined {
    // Stop if the page number is not a whole number from 1 to 604
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 604) return undefined;

    // Get this page's rows, in line order
    const rows = db.getAllSync<LayoutRow>(
        'SELECT line_number, line_type, first_word_id, last_word_id FROM pages WHERE page_number = ? ORDER BY line_number',
        [pageNumber]
    );

    // Turn each row into a list of glyphs
    return rows.map((row) => {
        // Surah header lines have no words
        if (row.line_type === 'surah_name') return [];

        const glyphs: string[] = [];
        for (let id = row.first_word_id; id <= row.last_word_id; id++) {
            const glyph = wordTextById.get(id);
            if (glyph !== undefined) glyphs.push(glyph);
        }
        return glyphs;
    });
}