export default class Group
{
    constructor(name)
    {
        this.name = name;
        this.id = String(Math.round(Math.random()*10000));
        this.tasks = [];
    }
}