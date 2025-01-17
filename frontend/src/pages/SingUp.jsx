
import Nav from '../components/Nav'
import { LoremIpsum } from "lorem-ipsum";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "../assets/output.gif"
import { useNavigate } from "react-router";
import { FiCoffee } from "react-icons/fi";
import Coffee from '../components/Coffee';
function SignUp() {
    const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const api = "https://backend.coffeetex.co";
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

);
 const display = () => {
     
  window.open(Image)

}
    
    return(
       <>
                <div className="container">
                    <Nav />
                
               
                    <br/>
                    <br/>
                    <div >
                        <center>
                        <h1>Welcome to CoffeeTek <FiCoffee /> </h1>
                        <h6>You can start writing in LaTex and generating PDF documents, Word, and Markdown files</h6>
                        <center>   <button className='button button-black tuto' onClick={display}>Tutorial</button></center>

                        </center>
                    </div>
                    <br/>
                    <div className='c'>
                      <img className='img1'  src={Image}/>
                    </div>
                    <br/>

                    <div >
                        <br/>
               
               <div className='container second-color'>
                <br/>
               
               <h4>Enter your user credentials</h4>
               <p>Please make sure to save your credentials in a safe place</p>
              <div className='row'>
                <div className='column'>
                <label>Enter your username</label>
                <input  placeholder="Username" onChange={handleUsername}/>
                </div>
                <div className='column'>
                <label>Enter your email</label>
                <input  placeholder="Email" onChange={handleEmail}/>
                </div>
              </div>
          
               <label>Enter your password</label>
               <input placeholder="password" type='password' onChange={handlePassword}/>
               <button className="button button-black" onClick={submit}>SingUp</button>
               <br/>
               </div>
               </div>
               <br/>
              
               <div className='row'>
                <div className='column'>
                <p>This web application is made by<br/> Louai Zaiter in 2024<br/> All rights reserved <br/> @CoffeeTek <FiCoffee/></p>

                </div>
                <div className='column'>
                    <p>This application is suitable for desktop computers and laptops. </p>
                </div>
                <div className='column'>
                 <p>Address:<br/>
                 Penglais Road,<br/> Aberystwyth,<br/> United Kingdom,<br/> SY23 3LH</p>
                </div>
               </div>
               <Coffee/>
               </div>

                </>
       
    )
}

export default SignUp; 