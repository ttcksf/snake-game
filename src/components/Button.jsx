import React from 'react'

const Button = ({status, onStart, onRestart}) => {
  return (
    <div className='button'>
      {
        status === "gameover" ?
        <button onClick={onStart}>gameover</button>
        :
        <button onClick={onStart}>start</button>
      }
    </div>
  )
}

export default Button
