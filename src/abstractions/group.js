export default class Group
{
    constructor(name)
    {
        this.name = name;
        this.id = String(Math.random()*1000);
    }
}