import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        'green-primary': '#2F855A', // darker green
        'green-light': '#A7F3D0',   // light green
        'cream-white': '#FFFBEA',
      },
    },
  },
};

export default config;
