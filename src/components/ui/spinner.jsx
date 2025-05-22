export default function Spinner() {
  return (
    <div className='bg-background flex h-screen flex-grow flex-col items-center justify-center'>
      <div className='border-primary inline-block size-12 animate-spin rounded-full border-3 border-t-transparent'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
