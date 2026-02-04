import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors can be added here
        // For example, if you want to customize gray-100:
        // gray: {
        //   100: '#f3f4f6', // or your custom value
        // },
      },
    },
  },
  plugins: [],
}

export default config

