import React, {useState, useEffect} from 'react';
import Navigation from './components/Navigation'
import Field from './components/Field'
import Button from './components/Button'
import ManipulationPanel from './components/ManipulationPanel'
import {initFields} from './utils'

const initialPosition = {x: 17, y: 17}
const initialValues = initFields(35, initialPosition)
const defaultInterval = 100

const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})

let timer = undefined

//タイマーを削除する関数
const unsubscribe = () => {
  if(!timer){
    return 
  }
  clearInterval(timer)
}

const isCollision = (fieldSize, position) => {
  if(position.y < 0 || position.x < 0){
    return true;
  }

  if(position.y > fieldSize - 1 || position.x > fieldSize - 1){
    return true;
  }

  return false;
}



function App() {
  const [fields, setFields] = useState(initialValues)
  const [position, setPosition] = useState()
  const [status, setStatus] = useState(GameStatus.init)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setPosition(initialPosition)
    //setIntervalは一定間隔ごとに実行する関数とその長さ
    timer = setInterval(() => {
      //ゲームの中の時間を管理する。stTickは一定間隔でレンダリングがトリガーされる関数。setIntervalのインターバルはdefaultIntervalの１００ミリ秒なので、１００ミリ秒ごとにレンダリングされる
      setTick(tick => tick + 1)
    }, defaultInterval)
    return unsubscribe
  },[])

  useEffect(() => {
    if(!position || status !== GameStatus.playing){
      return
    }
    //goUp()が続けられない時は停止する判定
    const canContinue = goUp()
    if(!canContinue){
      setStatus(GameStatus.gameover)
    }
  }, [tick])

  const onStart = () => setStatus(GameStatus.playing)

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    setStatus(GameStatus.init)
    setPosition(initialPosition)
    setFields(initFields(35, initialPosition))
  }

  const goUp = () => {
    const{x,y} = position
    //フィールドの新しい座標を取得。yに1を引いた数
    const newPosition = {x,y: y - 1}
    if(isCollision(fields.length, newPosition)){
      unsubscribe()
      return false
    }
    //フィールドステートfieldsの該当の座標を更新。スネークの元いた場所を空にする
    fields[y][x] = ''
    
    fields[newPosition.y][x] = 'snake'
    setPosition(newPosition)
    //setFieldsでフィールドステートを更新
    setFields(fields)
    return true
  }

  return (
    <div className="App">
      <header className='header'>
        <div className='title-container'>
          <h1 className='title'>Snake Game</h1>
        </div>
        <Navigation />
      </header>
      <main className='main'>
        <Field fields={fields} />
      </main>
      <footer className='footer'>
        <Button onStart={onStart} onRestart={onRestart} />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
