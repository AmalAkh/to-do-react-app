export default class SubTask
{
    constructor(text, completed=false)
    {
        this.text = text;
        this.completed = completed;
        this.id = String(Math.round(Math.random()*10000));
    }
}