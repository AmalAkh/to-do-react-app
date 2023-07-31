import { useEffect, useState, useRef } from "react";
import "./Accordion.scss";
export default function Accordion({title,children, isOpened=false, isIconVisible=true})
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
            
           

            content.current.style.height = `0px`;

        }
    },[opened])
    function openClose()
    {
        let height = contentInner.current.scrollHeight;

        content.current.style.height = `${height}px`;
        setOpened(!opened)
    }
    return (
    <div className="accordion" >
        <div class="accordion-top">
            <div className="accordion-top-content" onClick={openClose}>{title}</div>
            { isIconVisible && <button onClick={openClose}
                className={`button  open-close ${opened ? "opened":""} `}>
               
                <ion-icon class="icon icon-medium" name="chevron-down-outline"></ion-icon>
                
                
            </button>}
        </div>
        <div ref={content} onTransitionEnd={heightTransitionEnd} className={`accordion-content ${opened ? "opened":""}`} >
            <div ref={contentInner}>{children}</div>
        </div>
        
    </div>)
}