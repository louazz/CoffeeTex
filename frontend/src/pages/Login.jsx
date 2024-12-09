import Nav from '../components/Nav'
import { LoremIpsum } from "lorem-ipsum";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const api = "http://localhost:8000";
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
                    <br/>
                    <br/>
                    <div className="second-color">
                        <center>
                        <br/>
               <h4>Enter your user credentials</h4>
               <p> This application allows the user to create, edit, and export LaTex documents.</p>
               <br/>
               <br/>
               <label>Enter your username</label>
               <input  placeholder="Username" onChange={handleUsername}/>
               <label>Enter your password</label>
               <input placeholder="password" type='password' onChange={handlePassword}/>
               <button className="button button-black" onClick={submit}>Login</button>
               <br/>
               </center>
               </div>
                </div>
    
       
    )
}

export default Login; 