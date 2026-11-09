const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Let Metro bundle .wasm files, which expo-sqlite needs on the web
config.resolver.assetExts.push('wasm');

module.exports = config;