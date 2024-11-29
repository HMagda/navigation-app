import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#7F56D9',
                borderColor: '#EAECF0',
                labelColor: '#101828',
                urlColor: '#475467',
                buttonText: '#344054',
                buttonBorder: '#D6BBFB',
                secondaryText: '#6941C6',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            spacing: {
                buttonPaddingX: '14px',
                buttonPaddingY: '10px',
                formPaddingX: '24px',
                formPaddingY: '16px',
            },
            height: {
                menuItemHeight: '78px',
                buttonHeight: '40px',
            },
            borderRadius: {
                default: '8px',
            },
            fontSize: {
                buttonText: '14px',
                heading: '16px',
                paragraph: '14px',
            },
            fontWeight: {
                buttonText: '600',
                heading: '600',
            },
            backgroundColor: {
                cardBackground: '#F9FAFB',
            },
            margin: {
                cardPaddingTop: '24px',
                cardPaddingRight: '16px',
                cardPaddingBottom: '24px',
                cardPaddingLeft: '16px',
            },
        },
    },
    plugins: [],
};

export default config;
