import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [serverMessage, setServerMessage] = useState("Waiting for backend...");

  useEffect(() => {
    // Using EC2 instance URL
    fetch('http://ec2-54-210-167-76.compute-1.amazonaws.com:5050')
      .then(response => response.text())
      .then(data => setServerMessage(data))
      .catch(error => setServerMessage("Connection failed: " + error.message));
  }, []);

  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <h1>Testing. 2 :D</h1>
        <h1>Backend is saying: <strong>{serverMessage}</strong></h1>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App