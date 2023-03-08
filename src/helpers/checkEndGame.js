export const checkEndGame = (lastBoard) => {
  return lastBoard.every((square) => square !== null)
}
