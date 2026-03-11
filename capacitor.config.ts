import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.todohabit.app',
  appName: 'Flowday',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#7c3aed',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f0f1a',
    },
  },
  ios: {
    contentInset: 'always',
  },
}

export default config
