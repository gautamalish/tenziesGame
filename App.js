import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
export default function App() {
    const [rollCount,setRollCount]=React.useState(0)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [hours,setHours]=React.useState(0)
    const [minutes,setMinutes]=React.useState(0)
    const [seconds,setSeconds]=React.useState(0)
    const [timerStart,setTimerStart]=React.useState(false)
    const [timerInterval,setTimerInterval]=React.useState(null)
    let startTime;
    let localRollCount=parseInt(localStorage.getItem("count"))||1000
    const [bestRollCount,setBestRollCount]=React.useState(localRollCount)
    
    React.useEffect(()=>{
        localStorage.setItem("count",bestRollCount)
    },[bestRollCount])

    React.useEffect(() => {
        if (tenzies) {
            if (localRollCount>rollCount) {
                setBestRollCount(rollCount)
            }
            else if(localRollCount<rollCount){
                setBestRollCount(localRollCount)
            }
        }
    }, [tenzies]);

    
console.log(timerStart)
   function startTimer(){
    startTime=Date.now()
    const interval=setInterval(updateTimer,1000)
    setTimerInterval(interval)
   }

   function updateTimer(){
    let elapsedTime=Math.floor((Date.now()-startTime)/1000)
    setHours(Math.floor(elapsedTime/(60*60)))
    elapsedTime%=3600
    setMinutes(Math.floor(elapsedTime/60))
    setSeconds(elapsedTime % 60)
   }
   
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            clearInterval(timerInterval)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRollCount(prevCount=>prevCount+1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            clearInterval(timerInterval);
            setTimerStart(false)
            setMinutes(0)
            setSeconds(0)
            setHours(0)
            setRollCount(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
            Object.assign({}, die, { isHeld: !die.isHeld }) :
                die
        }))
        if(!timerStart){
            setTimerStart(prevtimer=>!prevtimer)
            startTimer()
        }
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="countdown">
                {hours.toString().padStart(2,0)}:
                {minutes.toString().padStart(2,0)}:
                {seconds.toString().padStart(2,0)}
            </div>
            <div className="bestCount">Best Count:{bestRollCount==1000?"0":bestRollCount}</div>
            <h2 className="rollCount">Count:{rollCount}</h2>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <p className="credit">Created by Alish</p>
        </main>
    )
}