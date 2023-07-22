import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'

function App() {
  const [groups, setGroups] = useState(["test1", "test2"]);
  const [currentGroup, setCurrentGroup] = useState("");


  function addNewGroup()
  {
   setGroups([...groups, "test3"])
  }

  return (
    <>
      <div className="tabs">
         
          <ul>
            {groups.map((group)=>
            {
              return (
              <li className={currentGroup==group ? "is-active":""} key={group} onClick={()=>{setCurrentGroup(group)}}>
                <a>{group}</a>
              </li>
              )
            })}
            <li>
              <button className="button is-white" onClick={addNewGroup}>+</button>
            </li>
            
          </ul>
      </div>
      <div className="container main-content-container	">
        <div className='content-block'>
          
        </div>
      </div>
    </>
  )
}

export default App
