const VARIANTS = {
    primary: 'bg-green text-white hover:bg-green-alt accent-green-alt'
}

export default function Button({ label, type, Icon, variant = 'primary' }) {
    let colorStyles = VARIANTS[variant];

    return (
        <button type={type}
            className={`w-full shadow-lg py-3 px-4 text-xl font-semibold tracking-wide rounded-lg inline-flex items-center justify-center ${colorStyles} cursor-pointer transition-colors`}>
            {Icon && <Icon className={`w-4 h-4 me-2 text-current`} />}
            {label}
        </button>
    )
}