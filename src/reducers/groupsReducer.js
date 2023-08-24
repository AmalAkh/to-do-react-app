import Task from "../abstractions/task";

export default function groupsReducer(groups, action)
{
    if(action.type == "add")
    {
        return [...groups, action.group]
    }else if(action.type == "update_name")
    {
        return [...groups.map((item)=>
            {
                if(item.id == action.id)
                {
                    return {...item , name:action.name};
                }else
                {
                    return item;
                }
            })]
    }else if(action.type == "add_task")
    {
        return groups.map((item)=>
            {
                if(item.id == action.groupId)
                {
                    return {...item, tasks:[...item.tasks, action.task ]};
                }else
                {
                    return item;
                }
            })
   
    }
    else if(action.type == "update_task")
    {
        return [...groups.map((group)=>
        {
            if(action.groupId == group.id)
            {
                return {...group, tasks:[...group.tasks.map((task)=>
                    {
                        if(task.id == action.task.id)
                        {
                            return {...action.task}
                        }else
                        {
                            return task;
                        }
                    })]};
            }else
            {
                return group;
            }
        })]
    }else
    {
        console.log(action);
        return groups
    }
}