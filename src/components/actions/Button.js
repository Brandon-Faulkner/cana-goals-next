const VARIANTS = {
    primary: 'text-xl font-semibold justify-center shadow-lg bg-green text-white hover:bg-green-alt accent-green-alt',
    default: 'text-lg font-medium hover:bg-green-alt accent-green',
}

export default function Button({ label, type = "button", Icon, variant = "primary", onClick }) {
    let varientStyle = VARIANTS[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            className={`inline-flex items-center w-full py-3 px-4 rounded-lg cursor-pointer transition-colors ${varientStyle} `}>
            {Icon && <Icon className={`w-4 h-4 me-2 text-current`} />}
            {label}
        </button>
    )
}