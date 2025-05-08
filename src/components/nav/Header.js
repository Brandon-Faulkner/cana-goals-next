import { FaCircleCheck } from 'react-icons/fa6';
import Image from 'next/image';
import Sidebar from './Sidebar';

export default function Header() {
    return (
        <header className="sticky top-0 w-full bg-white dark:bg-black shadow-lg z-50">
            <div className="mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                    <Image src="/android-chrome-192x192.png" alt="Cana Goals main logo" width={40} height={40} />
                    <h1 className="ml-2 text-xl font-semibold text-black dark:text-white max-xxs:hidden">Cana Goals</h1>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <FaCircleCheck className='text-green' />
                        <span className='text-black dark:text-white max-xs:hidden'>Up to Date</span>
                    </div>

                    <Sidebar />
                </div>
            </div>
        </header>
    );
}
