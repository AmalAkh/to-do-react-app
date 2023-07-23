import { useState, useId } from "react";
import "./CheckBox.scss";
export default function CheckBox({text="test", onChanged= ()=>{}})
{
    const [isChecked, setIsChecked] = useState(false);
    const id = useId();

    return (
        <>

        <label className="checkbox-label" htmlFor={id}>
            <input type="checkbox" id={id} className="checkbox" onChange={(e)=>
                {
                    onChanged(e);
                    setIsChecked(e.target.checked);
                }
            }/>
            <div className={`checkbox-box ${isChecked?"active":""}` }>
                <span></span>
            </div>
        </label>
       
        
    
        </>
    )
}