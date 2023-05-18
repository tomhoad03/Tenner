import { Colors } from '../styles'
import { textField } from '../styles/components'
import { textfieldLabel } from '../styles/labels'

interface TextFieldProps {
  title?: string
  text?: string
  secure?: boolean
  setText: React.Dispatch<React.SetStateAction<string | undefined>>
  style?: React.CSSProperties
}

const TextField: React.FC<TextFieldProps> = ({ title, text, secure, setText, style }) => {
  return (
    <div style={{ width: '100%', paddingTop: '5px', paddingBottom: '5px', ...style }}>
      <label htmlFor="text-field" style={textfieldLabel}>
        {title}
      </label>
      <input
        style={textField}
        onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
        onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
        id="text-field"
        type={secure ? 'password' : 'text'}
        value={text}
        onChange={e => {
          setText(e.target.value)
        }}
      />
    </div>
  )
}

export default TextField
