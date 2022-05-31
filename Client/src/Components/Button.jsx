import '../Styles/Button.scss'

let Button = ({ label, color, icon, disabled, className, ...props }) => {
    let classList = [ 'f-button' ];

    if (color) classList.push(`f-button__${color}`)
    if (disabled) classList.push(`f-button__disabled`)
    if (className) classList.push(className)

    return (
        <button className={classList.join(' ')} {...props}>
            { icon && <img className='f-button__icon' src={icon} alt='icon' /> }
            <text>{label}</text>
        </button>
    )
}

export default Button