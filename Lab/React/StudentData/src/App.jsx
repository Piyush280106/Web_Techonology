import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import StudentInfo from './StudentInfo'
import Student from './Student'

 function App() {
  // Simple event function
  const showMessage = () => {
    alert("Button Clicked!");
  };


    return (
    <>
      <h1>student info</h1>
      <button onClick={showMessage}>
        Click Me
      </button>
      <Student name="Piyush " age="21" course="AIML" />
    </>
  )
}
export default App


