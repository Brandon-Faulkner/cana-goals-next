export default function TextInput({ label, name, type, Icon, placeholder, required = true, ...props }) {
    return (
        <div>
            <label className="text-green text-lg mb-2 font-medium block">{label}</label>
            <div className="relative flex items-center z-10">
                <input name={name} type={type} required={required} {...props}
                    className="w-full text-base text-black font-default dark:text-white bg-white dark:bg-black border border-gray px-4 py-3 rounded-lg accent-green"
                    placeholder={placeholder} />
                <Icon className="w-4 h-4 absolute right-4 text-black dark:text-white"/>
            </div>
        </div>
    );
}