import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 14px 38px rgba(30, 77, 120, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
