import { createUseStyles } from 'react-jss'
import { Buttons, Labels } from '../styles'
import { ReactNode, useState } from 'react'

const useStyles = createUseStyles({ ...Buttons, ...Labels })

interface ButtonProps {
  children: React.ReactNode
}

export const MyButton: React.FC<ButtonProps> = ({ children }) => {
  const classes = useStyles()
  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

interface GreenButtonProps {
  title: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  id?: string
  style?: React.CSSProperties
}

export const GreenButton: React.FC<GreenButtonProps> = ({ title, onClick, id, style }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{ ...Buttons.greenButton, ...style, opacity: isPressed ? 0.8 : 1 }}
      id={id}
      onClick={onClick}>
      {title}
    </button>
  )
}

interface BlackButtonProps {
  title: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  id?: string
  style?: React.CSSProperties
}

export const BlackButton: React.FC<BlackButtonProps> = ({ title, onClick, id, style }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{ ...Buttons.blackButton, ...style, opacity: isPressed ? 0.8 : 1 }}
      id={id}
      onClick={onClick}>
      {title}
    </button>
  )
}

interface IconButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  id?: string
  style?: React.CSSProperties
  children: ReactNode
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, id, style, children }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{ ...Buttons.iconButton, ...style, opacity: isPressed ? 0.8 : 1 }}
      id={id}
      onClick={onClick}>
      {children}
    </button>
  )
}
