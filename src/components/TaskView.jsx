import { useState, useRef, useEffect, useContext} from "react";

import "./TaskView.scss";

import Accordion from "./Accordion";
import CheckBox from "./CheckBox";

import SubTask from "../abstractions/subtask";

import { GroupDispatchContext, CurrentGroupIdContext } from "../contexts/GroupsContext";
import groupsReducer from "../reducers/groupsReducer";

export default function TaskView({task})
{
    const [currentTask, setCurrentTask] = useState({});
    const [timeVisible, setTimeVisible] = useState(false);
    const [dateVisible, setDateVisible] = useState(false);
    const [isTaskNameEditable, setIsTaskNameEditable] = useState(false)

    const taskNameInput = useRef(null);

    const isTaskSet = useRef(false);


    const dispatchGroups = useContext(GroupDispatchContext)
    const currentGroupId = useContext(CurrentGroupIdContext)
    console.log(task);
    if(!isTaskSet.current)
    {
        isTaskSet.current = true;
        setCurrentTask(task)
        
    }

    useEffect(()=>
    {
        if(isTaskNameEditable)
        {
            taskNameInput.current.focus();
        }
    }, [isTaskNameEditable])
    
    function taskNameInputClick(e)
    {
        if(isTaskNameEditable)
        {
            e.stopPropagation();
        }
    }
    function startEditingTaskName(e)
    {
        
        if(!isTaskNameEditable)
        {
            e.stopPropagation();
            taskNameInput.current.focus();
        }
        setIsTaskNameEditable(!isTaskNameEditable);
    }
    function openCloseTask(e)
    {
        if(isTaskNameEditable)
        {
            e.stopPropagation();
        }
    }
    function updateTaskName(e)
    {
        console.log(currentGroupId)
        dispatchGroups({type:"update_task", groupId:currentGroupId, task:{...task, name:e.target.textContent}})
    }
    function updateNote(e)
    {
        e.target.style.height = `${e.target.scrollHeight}px`
        dispatchGroups({type:"update_task",groupId:currentGroupId, task:{...task, note:e.target.value}})
        console.log(e.target.value);
        
    }
    function addSubTask()
    {
        dispatchGroups({type:"update_task", groupId:currentGroupId, task:{...task, subTasks:[...task.subTasks, new SubTask("New subtask")]}})
    }
    function updateSubTaskName(e, id)
    {
        dispatchGroups({type:"update_task", groupId:currentGroupId, task:{...task, subTasks:[...task.subTasks.map((subTask=>
            {
                if(subTask.id == id)
                {
                    return {...subTask, text:e.target.value};
                }else
                {
                    return {...subTask};
                }
            }))]}})
    }
    function completeSubTask(e, id)
    {
        console.log(e.target.checked)
        
        dispatchGroups({type:"update_task", groupId:currentGroupId, task:{...task, subTasks:[...task.subTasks.map((subTask=>
            {
                if(subTask.id == id)
                {
                    return {...subTask, completed:e.target.checked};
                }else
                {
                    return {...subTask};
                }
            }))]}})
    }
    function completeTask(e)
    {
        console.log(e.target.checked);
        dispatchGroups({type:"update_task", task:{...task, completed:e.target.checked}, groupId:currentGroupId})
    }
    function removeTask()
    {
        dispatchGroups({type:"remove_task", groupId:currentGroupId, taskId:task.id})
    
    }  
    return (<>
        <div>
            <Accordion isIconVisible={false} title=
            {
                <div className="task-view" onClick={openCloseTask}>
                    <CheckBox checked={task.completed} onChanged={completeTask}/>
                    <p ref={taskNameInput} contentEditable={isTaskNameEditable} onClick={taskNameInputClick} onInput={updateTaskName}>{currentTask.name}</p>
                    <button className="button is-white" onClick={startEditingTaskName}>
                        {isTaskNameEditable && <ion-icon class="icon" name="checkmark-outline"></ion-icon>}
                        {!isTaskNameEditable && <ion-icon class="icon is-large" name="pencil-outline"></ion-icon>}
                    </button>
                    <button className="button is-white" onClick={()=>
                        {
                            removeTask()
                        }}>

                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
                
            } >
                <textarea defaultValue={currentTask.note} placeholder="Write a note"  onInput={updateNote} className="textarea">
                   
                </textarea>
                <div  className="sub-tasks-block">
                    
                    <h5 className="title is-6">Sub tasks</h5>
                    <ul className="sub-tasks-list">
                        {task.subTasks.map((item, index)=>
                        {
                            return <> 
                            <li className="sub-task">
                                <CheckBox checked={item.completed} onChanged={(e)=>
                                {
                                    completeSubTask(e, item.id)
                                }} />
                                <input className="input invisible-input" defaultValue={item.text} onInput={(e)=>
                                    {
                                        updateSubTaskName(e, item.id)
                                    }} type="text"/>
                            </li></>
                        })}
                        
                    </ul>
                    <button class="button is-ghost" onClick={addSubTask} >+Add sub task</button>
                </div>
                
            </Accordion>
            
        
        </div>
    </>)
    /*
    
    */
}