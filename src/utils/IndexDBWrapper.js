export default class IndexDBWrapper
{
    _db
    async init(onsuccess = ()=>{})
    {
        return  new Promise((resolve, reject)=>
        {
            let openRequest = indexedDB.open("to-do-app", 1)

        
            openRequest.onsuccess = ()=>
            {
                this._db = openRequest.result
               
                resolve(this._db)
                this._db.onversionchange = ()=>
                {
                    this._db.close();
                    console.log("version has changed")
                }
            
            };
            openRequest.onupgradeneeded = (e)=>
            {
                let db = openRequest.result;
                this._db = openRequest.result

                switch(e.oldVersion)
                {
                    case 0:
                        db.createObjectStore("groups", {keyPath:"id"})
                    
                    
                }
            }
            openRequest.onerror = (e)=>
            {
                console.log("an error occured");
                reject(e.target.error)
            }
        })
    }
    close()
    {
        this._db.close();
    }
    async getGroups()
    {
        return new Promise((resolve, reject)=>
        {
            
            let transaction = this._db.transaction("groups", "readonly")
            let store = transaction.objectStore("groups")
            let req = store.getAll();
            
            req.onsuccess = (e)=>{
                console.log(e.target.result);
                resolve(e.target.result)
            };
            req.onerror = (e)=>{reject(e.target.error)}
        })
    }
    async addGroup(group)
    {
        return new Promise((resolve, reject)=>
        {
            let transaction = this._db.transaction("groups", "readwrite")
            let store = transaction.objectStore("groups")
            let req = store.add(group)
            req.onsuccess = ()=>{resolve(group)};
            req.onerror = (e)=>{reject(e.target.error)}
        });
        
    }
    updateGroup(group)
    {
        return new Promise((resolve, reject)=>
        {
            let transaction = this._db.transaction("groups", "readwrite")
            let store = transaction.objectStore("groups")
            let req = store.put(group)
            req.onsuccess = ()=>{resolve(group)};
            req.onerror = (e)=>{reject(e.target.error)}
        })
    }
    removeGroup(groupId)
    {
        return new Promise((resolve, reject)=>
        {
            let transaction = this._db.transaction("groups", "readwrite")
            let store = transaction.objectStore("groups")
            let req = store.delete(groupId)
            req.onsuccess = ()=>{resolve(groupId)};
            req.onerror = (e)=>{reject(e.target.error)}
        })
    }
}
