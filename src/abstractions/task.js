export default class Task
{
    constructor(name, note="", subTasks=[], date=null)
    {
        this.name = name;
        this.note = note;
        this.subTasks = subTasks;
        this.date = date;
        this.id = String(Math.round(Math.random()*10000));
        this.completed = false;
    }
}