export default function Checkbox({ label, name }) {
    return (
        <div className="flex items-center cursor-pointer">
            <input id={name} name={name} type="checkbox"
                className="h-4 w-4 shrink-0 text-black dark:text-white focus:ring-green-alt border rounded accent-green cursor-pointer" />
            <label htmlFor={name} className="ml-3 block text-base text-black font-normal dark:text-white cursor-pointer">
                {label}
            </label>
        </div>
    );
}