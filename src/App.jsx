import { useState, useReducer } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import ReactDragListView from 'react-drag-listview/lib/index.js';

import Group from './abstractions/group'

import groupsReducer from './reducers/groupsReducer';

import CheckBox from './components/CheckBox'
import Accordion from './components/Accordion'
import TaskView from './components/TaskView'


import Task from './abstractions/task';

import { GroupDispatchContext, CurrentGroupIdContext } from './contexts/GroupsContext'


function createInitialGroups()
{
  return [new Group("Group1")]
}
function App() {
  let initialGroups = createInitialGroups();
  const [groups, dispatchGroups] = useReducer(groupsReducer, initialGroups);
  
  const [currentGroup, setCurrentGroup] = useState(initialGroups[0]);
  const [isOpened, setIsOpened] = useState(true);

  


  function updateGroupName(name, groupId)
  {
    
    dispatchGroups({name:name, id:groupId, type:"update_name"})
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
    dispatchGroups({group:new Group("Group 1"), type:"add"})
  }
  function addNewTask(name)
  {
    let task = new Task(name)
    console.log(currentGroup)
    console.log(groups[0])

    dispatchGroups({type:"add_task",groupId:currentGroup.id, task:task})

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
          
          <Accordion isOpened={isOpened} title={<h5 className='title is-5'>Active tasks</h5>}>
            <GroupDispatchContext.Provider value={dispatchGroups}>
                <CurrentGroupIdContext.Provider value={currentGroup.id}>
                  <ul>
                      {groups.find((group)=>{return group.id == currentGroup.id}).tasks.map((task)=>
                      {
                        return (<>
                        <li className="task-item" key={task.id}>
                          <TaskView task={task}/>
                        </li>
                        </>)
                      })}
                    
                  </ul>
                    <button className="button is-ghost add-new-task" onClick={()=>
                      {
                        addNewTask("New task")
                      }}>+ Add new task</button>
                </CurrentGroupIdContext.Provider>

              </GroupDispatchContext.Provider>
            </Accordion>
          
            
        </div>
      </div>
    </>
  )
}

export default App
