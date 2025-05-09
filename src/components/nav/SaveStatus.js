"use client"
import { FaCircleCheck } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthProvider';

export default function SaveStatus() {
    const {user, loading} = useAuth();

    if(!user) return null;

    return (
        <div className='flex items-center gap-2'>
            <FaCircleCheck className='text-green' />
            <span className='text-black dark:text-white max-xs:hidden'>Up to Date</span>
        </div>
    );
}
