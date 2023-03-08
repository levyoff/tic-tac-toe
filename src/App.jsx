import React, { useState } from 'react'
import { Square } from './components/Square/Square'
import './index.css'
import confetti from 'canvas-confetti'
import { Turns } from './constants'
import { checkWinner } from './helpers/checkWinner'
import { WinnerModal } from './components/WinnerModal/WinnerModal'
import { checkEndGame } from './helpers/checkEndGame'

function App () {
  // - La extracción de datos del LocalStorage la hacemos dentro de la incialización de estado,
  // debido a que es sincrono (lento), y solo nos interesa hacerlo la primera vez que ejecutamos la app.
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? Turns.x
  })
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(Turns.x)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // Si la casilla ya tiene algo, no permitimos que se reescriba.
    if (board[index] || winner) return

    // - Aqui creamos una copia del array original, porque en React no debemos mutar los componentes ni el estado.
    // El estado lo tenemos que actualizar usando el 'setState' de 'useState' y si ha habido modificaciones tienen que ser
    // en un array nuevo, no modificar el original.
    // - Aqui estamos actualizando el tablero.
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // - Cambiamos el turno del jugador
    const newTurn = turn === Turns.x ? Turns.o : Turns.x
    setTurn(newTurn)

    // - Guardamos la partida.
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(() => {
        return newWinner
      })
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  console.log(winner)

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((_, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>{_}</Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === Turns.x}>{Turns.x}</Square>
        <Square isSelected={turn === Turns.o}>{Turns.o}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
