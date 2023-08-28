import { useState, useRef, useEffect, useContext} from "react";

import "./TaskView.scss";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Accordion from "./Accordion";
import CheckBox from "./CheckBox";

import SubTask from "../abstractions/subtask";

import { GroupDispatchContext, CurrentGroupIdContext } from "../contexts/GroupsContext";
import { UpdateTaskContext } from "../contexts/UpdateTaskContext";

import groupsReducer from "../reducers/groupsReducer";

export default function TaskView({task})
{
    const [currentTask, setCurrentTask] = useState({});
   
    const [isTaskNameEditable, setIsTaskNameEditable] = useState(false)
    const [percentageBeforeCompleting, setPercentageBeforeCompleting] = useState(0);
    const [secondsBeforeCompleting, setSecondsBeforeCompleting] = useState(0);
    const [timerIsVisible, setTimerIsVisible] = useState(false);
    

    const taskNameInput = useRef(null);

    const isTaskSet = useRef(false);

    const intervalId = useRef(-1);
    //const completed = useRef();



    const dispatchGroups = useContext(GroupDispatchContext)
    const currentGroupId = useContext(CurrentGroupIdContext)
    const updateTask = useContext(UpdateTaskContext)

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
    function stopEditingName()
    {
        setIsTaskNameEditable(false)
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
        
        //dispatchGroups({type:"update_task", groupId:currentGroupId, task:{...task, name:e.target.textContent}})
        updateTask({...task, name:e.target.textContent})
    }
    function updateNote(e)
    {
        e.target.style.height = `${e.target.scrollHeight}px`
        updateTask({...task, note:e.target.value})
   
        
    }
    function addSubTask()
    {
        updateTask({...task, subTasks:[...task.subTasks, new SubTask("New subtask")]})
    }
    function updateSubTaskName(e, id)
    {
        updateTask({...task, subTasks:[...task.subTasks.map(subTask=>
            {
                if(subTask.id == id)
                {
                    return {...subTask, text:e.target.value};
                }else
                {
                    return {...subTask};
                }
            })]})
    }
    function completeSubTask(e, id)
    {
      
        updateTask({...task, subTasks:[...task.subTasks.map(subTask=>
            {
                if(subTask.id == id)
                {
                    return {...subTask, completed:e.target.checked};
                }else
                {
                    return {...subTask};
                }
            })]})
    }

    function completeTask(e)
    {
        if(intervalId.current == -1 && !task.completed)
        {
            let time = 0;
            setTimerIsVisible(true);
            
            intervalId.current = setInterval(()=>
            {
                time+=100;
                console.log("timing")
                setPercentageBeforeCompleting((time/5000)*100);
                setSecondsBeforeCompleting(Math.ceil((5000 - time)/1000))
                if(time >= 5000)
                {
                    console.log("completed")
                    updateTask({...task, completed:true})
                    
                    clearInterval(intervalId.current);
                    intervalId.current = -1
                }
            },100)
        }else if(intervalId.current == -1 && task.completed)
        {
      
            updateTask({...task, completed:false})

        }else
        {
            setTimerIsVisible(false);
            setPercentageBeforeCompleting(0);
            setSecondsBeforeCompleting(5);
            clearInterval(intervalId.current);

        }
        
    }
    function removeTask()
    {
     
        updateTask({...task}, removeTask=true)
    
    }  
    return (<>
        <div>
            <Accordion isIconVisible={false} title=
            {
                <div className="task-view" onClick={openCloseTask}>
                    <CheckBox checked={task.completed} onChanged={completeTask}/>
                    <p ref={taskNameInput} contentEditable={isTaskNameEditable} onClick={taskNameInputClick} onBlur={stopEditingName} onInput={updateTaskName}>{currentTask.name}</p>
                    {timerIsVisible && <CircularProgressbar value={percentageBeforeCompleting} text={secondsBeforeCompleting} />}
            
                    <button className="button is-white" onClick={startEditingTaskName}>
                        {isTaskNameEditable && <ion-icon class="icon" name="checkmark-outline"></ion-icon>}
                        {!isTaskNameEditable && <ion-icon class="icon is-large" name="pencil-outline"></ion-icon>}
                    </button>
                    <button className="button is-white" onClick={(e)=>
                        {
                            e.stopPropagation();
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