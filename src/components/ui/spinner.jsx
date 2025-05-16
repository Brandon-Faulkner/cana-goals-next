export default function Spinner() {
  return (
    <div className="flex flex-col flex-grow h-full bg-background items-center justify-center">
      <div className="animate-spin inline-block size-12 border-3 border-primary border-t-transparent rounded-full">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
