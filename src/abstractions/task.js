export default class Task
{
    constructor(text, note="", subTasks=[], date=null)
    {
        this.text = text;
        this.note = note;
        this.subTasks = subTasks;
        this.date = date;
    }
}