import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import ReactDragListView from 'react-drag-listview/lib/index.js';

import Group from './abstractions/group'

import CheckBox from './components/CheckBox'
import Task from './abstractions/task';

function createInitialGroups()
{
  return [new Group("Group1")]
}
function App() {
  const [groups, setGroups] = useState(createInitialGroups());
  const [currentGroup, setCurrentGroup] = useState(groups[0]);


  function updateGroupName(name, groupId)
  {
    
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
  function addNewTask(name)
  {
    setGroups([...groups.map((item)=>
    {
      if(item.id == currentGroup.id)
      {
        return {...item, tasks:[...item.tasks, new Task(name)]}
      }else
      {
        return group;
      }
    })])
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
              {groups.find((group)=>{return group.id == currentGroup.id}).tasks.map((task)=>
              {
                return (<>
                <li className="task-item">
                <CheckBox />
                <p contentEditable="true" onClick={(e)=>{e.stopPropagation()}} >{task.name}</p>
       
              </li>
                </>)
              })}
              <li className="task-item">
                <CheckBox />
                <p contentEditable="true" onClick={(e)=>{e.stopPropagation()}} >test</p>
       
              </li>
            </ul>
            <button className="button is-ghost add-new-task" onClick={()=>
              {
                addNewTask("New task")
              }}>+ Add new task</button>
        </div>
      </div>
    </>
  )
}

export default App
