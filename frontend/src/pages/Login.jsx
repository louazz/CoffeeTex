import Nav from '../components/Nav'
import { LoremIpsum } from "lorem-ipsum";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Image from "../assets/login_im.png"
import { FiCoffee } from "react-icons/fi";
import Coffee from '../components/Coffee';

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const api = "http://167.99.197.228:8000";
    const submit = () => {
        axios.post(api + "/api/signin", {
            username: username,
            password: password
        }
        ).then(
            res => {


                if (res.status == 200 || res.status==201 || res.status==201) {
                    localStorage.setItem("userId",  res.data["userId"])
                    localStorage.setItem("token", res.data["token"])
                    navigate("/search")
                } else {

                    alert("try logging in again, an error has occured")
                }
            }
        ).catch(
            function (error) {
                alert("internal server error")
            }
        )
    }
    useEffect(() => {
        if (localStorage.getItem("token") != undefined) {
            navigate("/browse")
        }
    })
    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const lorem = new LoremIpsum(
        {
            sentencesPerParagraph: {
                max: 8,
                min: 5
            },
            wordsPerSentence: {
                max: 16,
                min: 15
            }
        },

    )
    return(
       
                <div className="container">
                    <Nav />
                    
                    <Coffee/>
                    <br/>
                    <br/>
                    <div >
                        <center>
                          <h1>Welcome to CoffeeTex <FiCoffee /> </h1>
                          <h6>You can start writing in LaTex and generating PDF documents, Word, and Markdown files</h6>
                        </center>
                    </div>
                    <br/>
                    <div className='c'>
                      <img className='img1'  src={Image}/>
                    </div>
                    <br/>
                    <div className="second-color">
                        <br/>
               <h4>Enter your user credentials</h4>
               <p> This application allows the user to create, edit, and export LaTex documents.</p>
    
               <div className='row'>
                <div className='column'>
                <label>Enter your username</label>
                <input  placeholder="Username" onChange={handleUsername}/>
                </div>
                <div className='column'>
                <label>Enter your password</label>
                <input placeholder="password" type='password' onChange={handlePassword}/>
                </div>
               </div>
               <button className="button button-black" onClick={submit}>Login</button>
               <br/>
               </div>
               <br/>
               <br/>
               <div className='row'>
                <div className='column'>
                <p>This web application is made by<br/> Louai Zaiter in 2024<br/> All right are reserved <br/> Instagram: @CoffeeTex <FiCoffee/></p>

                </div>
                <div className='column'>
                    <p>This application is suitable for desktop computers and laptops. </p>
                </div>
                <div className='column'>
                 <p>Address:<br/>
                 Penglais Road,<br/> Aberystwyth,<br/> United Kingdom,<br/> SY23 3LH</p>
                </div>
               </div>
                </div>
    
       
    )
}

export default Login; 