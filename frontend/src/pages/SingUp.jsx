
import Nav from '../components/Nav'
import { LoremIpsum } from "lorem-ipsum";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
function SignUp() {
    const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const api = "http://localhost:8000";
  const navigate = useNavigate();
  function submit() {
      console.log(username)
      console.log(password)
    axios.post(api + '/api/signup', {
      username: username,
      password: password,
      email: email
    }).then(
      res => {
        if (res.status == 201) {
          alert('registration succeeded')
          navigate("/login")
        } else {
          alert("an error has occured, please try again")
        }
      }
    ).catch(function (error) {
      alert('internal server error')
    })
  }
  useEffect(() => {
    if (localStorage.getItem("token") != undefined) {
      navigate("/search")
    }
  })
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleUsername = (e) => {
    setUsername(e.target.value)
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
               <label>Enter your email</label>
               <input  placeholder="Email" onChange={handleEmail}/>
               <label>Enter your password</label>
               <input placeholder="password" type='password' onChange={handlePassword}/>
               <button className="button button-black" onClick={submit}>SingUp</button>
               <br/>
               </center>
               </div>
                </div>
    
       
    )
}

export default SignUp; 