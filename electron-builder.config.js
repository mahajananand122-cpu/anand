module.exports = {
  appId: "com.tradelog.desktop",
  productName: "TradeLog",
  directories: {
    output: "release",
    buildResources: "electron",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "node_modules/better-sqlite3/**/*",
    "node_modules/bindings/**/*",
    "node_modules/file-uri-to-path/**/*",
    "node_modules/prebuild-install/**/*",
  ],
  extraMetadata: {
    main: "electron/main.js",
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    icon: "electron/icon.png",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: "electron/icon.png",
    uninstallerIcon: "electron/icon.png",
    installerHeaderIcon: "electron/icon.png",
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "TradeLog",
  },
  asar: true,
  asarUnpack: [
    "node_modules/better-sqlite3/**/*",
  ],
};
