import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type TextLayoutEvent,
} from 'react-native';
import * as Font from 'expo-font';
import { pageFonts } from '../quran/pageFonts';

// Size used only for measuring. Width grows in a straight line with font size,
// so we can scale from this size to the size that fits.
const TEST_SIZE = 100;

type ArabicPageProps = {
  pageNumber: number;   // which Mushaf page this is (1 to 604)
  lines: string[][];    // each line is a list of glyph strings
};

export function ArabicPage({ pageNumber, lines }: ArabicPageProps) {
  // Name of the font for this page, e.g. "QPC-page-1"
  const fontFamily = `QPC-page-${pageNumber}`;

  const [fontReady, setFontReady] = useState(Font.isLoaded(fontFamily));
  const [error, setError] = useState<string | null>(null);

  // Width of the space the lines must fit in
  const [availableWidth, setAvailableWidth] = useState(0);

  // Measured width of each line at TEST_SIZE, keyed by line index
  const [lineWidths, setLineWidths] = useState<Record<number, number>>({});

  // Load this page's font
  useEffect(() => {
    let active = true;

    if (Font.isLoaded(fontFamily)) {
      setFontReady(true);
      return;
    }

    Font.loadAsync({ [fontFamily]: pageFonts[pageNumber] })
      .then(() => {
        if (active) setFontReady(true);
      })
      .catch((e) => {
        if (active) setError(String(e));
      });

    return () => {
      active = false;
    };
  }, [pageNumber, fontFamily]);

  // Forget old measurements when the page changes
  useEffect(() => {
    setLineWidths({});
  }, [pageNumber]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Could not load page {pageNumber}</Text>
      </View>
    );
  }

  if (!fontReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  // Lines that have text (skip the empty surah-name row)
  const textLines = lines
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.length > 0);

  // Have all text lines been measured yet?
  const allMeasured = textLines.every((item) => (lineWidths[item.index] ?? 0) > 0);

  // The widest line decides the size for the whole page
  const widest = Math.max(0, ...textLines.map((item) => lineWidths[item.index] ?? 0));

  // Largest size where the widest line still fits
  const fontSize =
    allMeasured && availableWidth > 0 && widest > 0
      ? Math.floor((TEST_SIZE * availableWidth) / widest)
      : null;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View onLayout={(e: LayoutChangeEvent) => setAvailableWidth(e.nativeEvent.layout.width)}>
        {fontSize === null ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : (
          lines.map((line, index) => {
            // Empty line (the surah banner row): keep the space
            if (line.length === 0) {
              return <View key={index} style={{ height: fontSize * 2 }} />;
            }

            return (
              <View key={index} style={styles.line}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.text,
                    { fontFamily, fontSize, lineHeight: fontSize * 2 },
                  ]}
                >
                  {line.join('')}
                </Text>
              </View>
            );
          })
        )}

        {/* Hidden measuring pass: runs until every line's width is known */}
        {fontSize === null && (
          <View style={styles.measure} pointerEvents="none">
            {textLines.map((item) => (
              <Text
                key={item.index}
                onTextLayout={(e: TextLayoutEvent) => {
                  const width = e.nativeEvent.lines.reduce(
                    (max: number, l: { width: number }) => Math.max(max, l.width),
                    0,
                  );
                  setLineWidths((prev) =>
                    prev[item.index] === width ? prev : { ...prev, [item.index]: width },
                  );
                }}
                style={[
                  styles.text,
                  { fontFamily, fontSize: TEST_SIZE, lineHeight: TEST_SIZE * 2 },
                ]}
              >
                {item.line.join('')}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hidden and off to the side, so it takes no space on screen.
  // Very wide, so no line wraps while it is being measured.
  measure: {
    position: 'absolute',
    opacity: 0,
    width: 5000,
  },
  text: {
    color: '#000',
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});