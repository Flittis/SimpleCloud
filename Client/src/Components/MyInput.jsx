import '../Styles/MyInput.scss'


function MyInput(props) {
    return (
            <div class="input-group">
              <input type={props.type} placeholder={props.placeholder} />
            </div>
    );
}

export default MyInput;
