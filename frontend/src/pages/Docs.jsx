import { useState } from 'react'
import Sample from '../components/Render.jsx'
import Nav from '../components/Nav.jsx'
import {internalIpV4} from 'internal-ip';

export default function Doc(){
    const local_ip = internalIpV4();
    const [fileUrl, setFileUrl]= useState(`http://${local_ip}:3000/tuto.pdf`)


    return(
        <div className='container'>
         <Nav />
                    <br/>
                    <br/>
        <Sample file={fileUrl} />
        </div>
    )
}