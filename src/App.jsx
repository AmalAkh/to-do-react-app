import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import ReactDragListView from 'react-drag-listview/lib/index.js';

import Group from './abstractions/group'

import CheckBox from './components/CheckBox'

function createInitialGroups()
{
  return [new Group("Group1")]
}
function App() {
  const [groups, setGroups] = useState(createInitialGroups());
  const [currentGroup, setCurrentGroup] = useState(groups[0]);


  function updateGroupName(name, groupId)
  {
    console.log("updated")
    setGroups([...groups.map((item, index)=>
      {
        if(item.id == groupId)
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
              
                <li className={currentGroup.id==group.id ? "is-active":""} key={index} onClick={()=>{setCurrentGroup(group)}}>
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
        <h3 className='title is-3 group-title' contentEditable="true" 
        onInput={(e)=>
        {
          updateGroupName(e.target.textContent, currentGroup.id)
        }}>{currentGroup.name}</h3>
        <div className='content-block'>
            <ul>
              <li>
                <CheckBox />
                <p contentEditable="true" onClick={(e)=>{e.stopPropagation()}} >test</p>
       
              </li>
            </ul>
        </div>
      </div>
    </>
  )
}

export default App
