import '../Styles/MyInput.scss'


function MyInput(props) {
    return (
            <div class="input-group">
              <input type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
            </div>
    );
}

export default MyInput;
