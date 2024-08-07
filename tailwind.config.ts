import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                light: 'hsl(var(--light))',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    darkMode: 'class',
    plugins: [
        nextui({
            layout: {
                disabledOpacity: '0.3', // opacity-[0.3]
                radius: {
                    small: '4px', // rounded-small
                    medium: '6px', // rounded-medium
                    large: '8px', // rounded-large
                },
                borderWidth: {
                    small: '1px', // border-small
                    medium: '2px', // border-medium
                    large: '3px', // border-large
                },
            },
            themes: {
                light: {},
                dark: {},
            },
        }),
        require('@tailwindcss/typography'),
    ],
};

export default config;
