import { Labels } from '../styles'
import { Colors } from '../styles'
import { textArea } from '../styles/components'

interface TextAreaProps {
  title?: string
  text?: string
  placeholder?: string
  setText: React.Dispatch<React.SetStateAction<string | undefined>>
  style?: React.CSSProperties
  horizontal?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({ title, text, placeholder, setText, style, horizontal }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: horizontal ? 'row' : 'column' }}>
      <label htmlFor="text-area" style={Labels.textfieldLabel}>
        {title}
      </label>
      <textarea
        style={{ ...textArea, ...style, flex: 1 }}
        placeholder={placeholder}
        onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
        onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
        id="text-area"
        value={text}
        onChange={e => {
          setText(e.target.value)
        }}
      />
    </div>
  )
}

export default TextArea
