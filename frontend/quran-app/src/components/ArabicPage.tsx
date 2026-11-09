import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { pageFonts } from '../quran/pageFonts';

// The props this component takes
export type ArabicPageProps = {
    pageNumber: number;      // which Mushaf page, 1 to 604
    lines: string[][];       // each line is a list of word glyphs, in reading order
};

export function ArabicPage({ pageNumber, lines }: ArabicPageProps) {
    // A unique name for this page's font
    const fontName = `QPC-page-${pageNumber}`;

    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // Stop the async work if the page changes before it finishes
        let cancelled = false;

        // Stop if there is no font file for this page number
        const source = pageFonts[pageNumber];
        if (source === undefined) {
            setFailed(true);
            return;
        }

        // Skip loading if this font was already loaded
        if (Font.isLoaded(fontName)) {
            setReady(true);
            return;
        }

        setReady(false);
        setFailed(false);

        // Load the font, then mark the page ready
        Font.loadAsync({ [fontName]: source })
            .then(() => { if (!cancelled) setReady(true); })
            .catch(() => { if (!cancelled) setFailed(true); });

        return () => { cancelled = true; };
    }, [pageNumber, fontName]);

    // Show a message if the font could not load
    if (failed) {
        return (
            <View style={styles.box}>
                <Text>Page {pageNumber} could not be loaded.</Text>
            </View>
        );
    }

    // Show a spinner until the font is ready
    if (!ready) {
        return (
            <View style={styles.box}>
                <ActivityIndicator />
            </View>
        );
    }

    // Draw each line with this page's font
    return (
        <View style={styles.page}>
            {lines.map((line, index) => (
                <Text key={index} style={[styles.line, { fontFamily: fontName }]}>
                    {line.join('')}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 16,
    },
    line: {
        fontSize: 28,
        lineHeight: 52,
        textAlign: 'center',
        writingDirection: 'rtl',
    },
    box: {
        padding: 16,
        alignItems: 'center',
    },
});