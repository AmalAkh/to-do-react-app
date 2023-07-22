import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import ReactDragListView from 'react-drag-listview/lib/index.js';

import Group from './abstractions/group'

function createInitialGroups()
{
  return [new Group("Group1")]
}
function App() {
  const [groups, setGroups] = useState(createInitialGroups());
  const [currentGroup, setCurrentGroup] = useState("");

  function updateGroupName(name, groupIndex)
  {
    console.log("updated")
    setGroups([...groups.map((item, index)=>
      {
        if(index == groupIndex)
        {
          return {...item, name:name}
        }else
        {
          return item;
        }
      })])
  }
  function changeGroupPosition(fromIndex, toIndex)
  {
    /*let newGroups = Object.assign({}, group);
    let element = newGroups[fromIndex];
    newGroups[fromIndex] = newGroups[index]
    newGroups[toIndex] = element;
    setGroups(newGroup)*/
    const data = [...groups];
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    setGroups(data)
  }
  function removeGroup(id)
  {

  }
  function addNewGroup()
  {
   setGroups([...groups, new Group(`Group ${groups.length}`)])
  }

  return (
    <>
      <div className="tabs">
          
          <ul>
            {groups.map((group, index)=>
            {
              return (
              
                <li className={currentGroup==group.id ? "is-active":""} key={index} onClick={()=>{setCurrentGroup(group.id)}}>
                  <a className="group-editable-name" >{group.name}</a>
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
