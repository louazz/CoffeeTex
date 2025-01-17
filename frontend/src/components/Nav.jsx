

import '../assets/App.css'
import { FiCoffee } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import PDF from '../assets/tuto.pdf'
import { useNavigate } from "react-router";
function Nav() {
    const [logged, setlogged] = useState(false)
    const navigate = useNavigate()
    // const [isLoading, setIsLoading]= useState(false)
    useEffect(() => {
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == undefined) {
            setlogged(false)
        } else {
            setlogged(true)
        }
    })
    const logout = () => {
        localStorage.clear()
        navigate("/")
    }
 
 return(
    <>
    <br/>
        <br/>
        
        <div className="row">
            <div className="column">
        
                <h4><FiCoffee /> <strong>CoffeeTek</strong></h4>
            </div>
            <div className="column">
                <div className="box">
                    <div className="one">
                        <a onClick={()=>{window.open(PDF)}}>Documentation</a>
                    </div>
                    <div className="one">
                        <a onClick={()=>{navigate('/search')}}>Browse</a>
                    </div>
                
                </div>
            </div>

            <div className="column">

            {logged == false ? <><div className="column"><button className="button button-black float-right" onClick={() => [navigate("/")]}>Signup</button>&nbsp;<button className="button button-black button-clear float-right" onClick={() => { navigate("/login"); } }>Login </button></div></> : <div className="column"><button className="button button-black float-right" onClick={logout}>logout</button></div>

                    }
            </div>
            </div>

     

    </>
 )   
}
export default Nav;