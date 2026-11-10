import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

// The layout database bundled with the app
const layoutDbAsset = require('../../data/qpc-v4-tajweed-15-lines.db');

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="layout.db"
      assetSource={{ assetId: layoutDbAsset }}
    >
      <Stack />
    </SQLiteProvider>
  );
}