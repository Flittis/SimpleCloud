import '../Styles/Textfield.scss'

let Textfield = ({ disabled, color, className, trailing, ...props }) => {
    let classList = [ 'f-textfield' ];

    if (color) classList.push(`f-textfield__${color}`)
    if (disabled) classList.push(`f-textfield__disabled`)
    if (className) classList.push(className)
    
    return (
        <label className={classList.join(' ')}>
            { trailing }
            <input className="f-textfield__input" {...props} />
        </label>
    )

}

export default Textfield
