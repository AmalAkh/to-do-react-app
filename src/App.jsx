import { useState, useReducer, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import ReactDragListView from 'react-drag-listview/lib/index.js';

import Group from './abstractions/group'

import groupsReducer from './reducers/groupsReducer';

import IndexDBWrapper from './utils/IndexDBWrapper';

import CheckBox from './components/CheckBox'
import Accordion from './components/Accordion'
import TaskView from './components/TaskView'


import Task from './abstractions/task';


import { GroupDispatchContext, CurrentGroupIdContext } from './contexts/GroupsContext'
import { UpdateTaskContext } from './contexts/UpdateTaskContext';

function createInitialGroups()
{
  return []
}
function App() {
  let initialGroups = createInitialGroups();
  const [groups, dispatchGroups] = useReducer(groupsReducer, initialGroups);
  
  const [currentGroup, setCurrentGroup] = useState(()=>
  {
    if(groups.length > 0)
    {
      return groups[0];
    }else
    {
      return null
    }
  });
  const [isOpened, setIsOpened] = useState(true);
  const db = useRef(null);
  
  useEffect(()=>
  {
      db.current = new IndexDBWrapper();
      
      (async()=>
      {
        let t  = await db.current.init();
        db.current._db = t;
        let groups = await db.current.getGroups();
        console.log(groups)
        setCurrentGroup(groups[0])
        dispatchGroups({type:"set_groups", groups:groups})
        
        
      })()
      
  },[])
  
  async function updateGroupName(name, groupId)
  {
    setCurrentGroup({...currentGroup, name:name})
    db.current.updateGroup({...currentGroup, name:name})
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
    let newGroup = new Group("Group 1")
    dispatchGroups({group:newGroup, type:"add"})
    setCurrentGroup(newGroup)
    db.current.addGroup(newGroup)
  }
  async function addNewTask(name)
  {
    let task = new Task(name)

    setCurrentGroup({...currentGroup, tasks:[...currentGroup.tasks, task]})
    db.current.updateGroup({...currentGroup, tasks:[...currentGroup.tasks, task]})
    dispatchGroups({type:"add_task",groupId:currentGroup.id, task:task})

  }
  function updateTask(updatedTask, removeTask=false)
  {
    if(!removeTask)
    {
      db.current.updateGroup({...currentGroup, tasks:currentGroup.tasks.map((task)=>
        {
          if(task.id == updatedTask.id)
          {
            return {...updatedTask}
          }else
          {
            return task
          }
        })})
      dispatchGroups({type:"update_task",groupId:currentGroup.id, task:updatedTask})
    }else
    {
      db.current.updateGroup({...currentGroup, tasks:currentGroup.tasks.filter((task)=>
        {
         return task.id != updatedTask.id
        })})
      dispatchGroups({type:"remove_task",groupId:currentGroup.id, taskId:updatedTask.id})
   
      
    }

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
        { currentGroup != null && <> <input key={currentGroup.id} className='input invisible-input group-name-input' defaultValue={currentGroup.name} contentEditable="true" 
        onInput={(e)=>
        {
          updateGroupName(e.target.value, currentGroup.id)
        }}/>

        <div className='content-block'>
          
          <Accordion isOpened={isOpened} title={<h5 className='title is-5'>Active tasks</h5>}>
            <GroupDispatchContext.Provider value={dispatchGroups}>
                <CurrentGroupIdContext.Provider value={currentGroup.id}>
                  <UpdateTaskContext.Provider value={updateTask}>
                    <ul>
                        {groups.find((group)=>{return group.id == currentGroup.id}).tasks.filter((task)=>!task.completed).map((task)=>
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
                  </UpdateTaskContext.Provider>
                </CurrentGroupIdContext.Provider>

              </GroupDispatchContext.Provider>
            </Accordion>

          </div>
          <div className='content-block completed-tasks-block'>

            <Accordion  title={<h5 className='title is-5'>Completed tasks</h5>}>
              <GroupDispatchContext.Provider value={dispatchGroups}>
              <UpdateTaskContext.Provider value={updateTask}>
                  
                  <CurrentGroupIdContext.Provider value={currentGroup.id}>
                    <ul>
                        {groups.find((group)=>{return group.id == currentGroup.id}).tasks.filter((task)=>task.completed).map((task)=>
                        {
                          return (<>
                          <li className="task-item" key={task.id}>
                            <TaskView inCompletedGroup={true} task={task}/>
                          </li>
                          </>)
                        })}
                      
                    </ul>
                     
                  </CurrentGroupIdContext.Provider>
                </UpdateTaskContext.Provider>
                </GroupDispatchContext.Provider>
            </Accordion>
          </div>
          </> }
        
      </div>
    </>
  )
}

export default App
