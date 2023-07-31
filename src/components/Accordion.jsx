import { useEffect, useState, useRef } from "react";
import "./Accordion.scss";
export default function Accordion({title,children, isOpened=false})
{
    const [opened, setOpened] = useState(isOpened);
    const contentInner = useRef(null);
    const content = useRef(null);
    

    function heightTransitionEnd(e)
    {
        if(e.propertyName == "height" && opened == true)
        {
            content.current.style.height = `auto`;
            
        }
    }
    useEffect(()=>
    {
        let height = contentInner.current.scrollHeight;
        console.log(contentInner.current.scrollHeight)
        if(opened)
        {
            content.current.style.height = `${height}px`;
        }else
        {
            console.log("that")
           

            content.current.style.height = `0px`;

        }
    },[opened])
    return (
    <div className="accordion" >
        <div class="accordion-top">
            <div className="accordion-top-content">{title}</div>
            <button onClick={()=>{
                let height = contentInner.current.scrollHeight;

                content.current.style.height = `${height}px`;
                setOpened(!opened)
            }
                } className={`button  open-close ${opened ? "opened":""} `}>
               
                <ion-icon class="icon icon-medium" name="chevron-down-outline"></ion-icon>
                
                
            </button>
        </div>
        <div ref={content} onTransitionEnd={heightTransitionEnd} className={`accordion-content ${opened ? "opened":""}`} >
            <div ref={contentInner}>{children}</div>
        </div>
        
    </div>)
}