import '../../index.css'

export const Square = ({ children, updateBoard, isSelected, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const clickHandler = () => { updateBoard(index) }

  return (
    <div className={className} onClick={clickHandler}>
      {children}
    </div>
  )
}
