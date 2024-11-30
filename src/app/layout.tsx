import type {Metadata} from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'Navigation Manager',
    description:
        'A tool to manage navigation items with drag-and-drop functionality.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang='en'>
            <body className='antialiased bg-mainBackground text-gray-900 font-inter'>
                {children}
            </body>
        </html>
    );
}
