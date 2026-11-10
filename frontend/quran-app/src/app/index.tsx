import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView } from 'react-native';
import { ArabicPage } from '../components/ArabicPage';
import { getPageLines } from '../quran/layout';

export default function Index() {
  // The database that the provider in _layout.tsx opened
  const db = useSQLiteContext();

  // Read page 1's lines from the database
  const lines = getPageLines(db, 1);

  // Draw the page. Use an empty list if the page couldn't be read.
  return (
    <ScrollView>
      <ArabicPage pageNumber={1} lines={lines ?? []} />
    </ScrollView>
  );
}