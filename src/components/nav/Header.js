import Image from 'next/image';

export default function Header() {
    return (
        <header className="sticky top-0 w-full bg-white dark:bg-black shadow-lg z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                    <Image src="/android-chrome-192x192.png" alt="Cana Goals main logo" width={40} height={40} />
                    <span className="ml-2 text-xl font-semibold text-black dark:text-white">Cana Goals</span>
                </div>
            </div>
        </header>
    );
}
