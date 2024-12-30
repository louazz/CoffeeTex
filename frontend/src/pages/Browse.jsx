import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Nav from '../components/Nav.jsx';
import { FiCoffee } from "react-icons/fi";

function Browse() {
    const [data, setData] = useState([
    ])
    const [res, setRes] = useState(data)
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const [checker, setChecker] = useState(false);
    const [txt, setText] = useState("")
    const [file, setFile] = useState([]);
    const [event, setEvent] = useState()
    const api = "http://localhost:8000";
    useEffect(() => {
        if (localStorage.getItem("token") == undefined || localStorage.getItem("token") == null) {
            navigate("/login")
        } else {
            if (checker == false) {
                axios.get(api + "/api/document/user/"+localStorage.getItem("userId"), {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem("token")}`
                    }
                }).then(
                    response => {
                        if (response.status == 200 || response.status == 201) {
                            console.log(response.data.documents)
                            setRes(response.data.documents)
                            setData(response.data.documents)
                            setChecker(true)
                        } else {
                            localStorage.clear()
                            alert("An error has occured, please try to refresh the page")
                        }
                    }
                )
            }
        }
    })

    const generateText = (e) =>{
        const id = localStorage.getItem("userId");
        setFile(e.target.files[0])
        setFile(e.target.files[0])
        
        const formData = new FormData();
        formData.append('key', file);
        console.log(id)
        console.log(formData)
        axios.post(
            api + "/api/document/text/" + id,
            formData,
            {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "multipart/form-data",
                },}
        )
        .then((response) => {
            if (response.status == 200 || response.status == 201) {
                var file = new Blob([response.data], {type: "text/plain"})
               
                var fileUrl = URL.createObjectURL(file);
                console.log(fileUrl)
                setText(fileUrl)
                if (fileUrl != null) {
                    window.open(fileUrl)
                }
            }

        })
        .catch(function () {
           console.log("failed to upload file: try again")
        })
    }
    //handle delete
    const handleDelete = (id) => {
        axios.delete(api + "/api/document/" + id, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(
            res => {
                if (res.status == 200 || res.status==201) {
                
                    setChecker(false)
                } else if (res.status == 400) { localStorage.clear() }
                else {
                    alert("internal server error")
                }
            }
        )
    }
    // view doc
    const handleView = (id) => {
        //navigate("/view/" + id)
    }
    const handleEdit = (id) => {
        navigate("/document/" + id)
    }

    //new document
    const handleChange = (e) => {

        if (e.target.value == "") {
            setRes(data)
        } else {
            setRes(data.filter(item => item.title.includes(e.target.value)))
        }

    }
    const handleNew = () => {
        var title = window.prompt("insert a title");
        if (title != "") {
            axios.post(api + '/api/document', {
                user_id: localStorage.getItem("userId"),
                title: title,
                content: `\n\\documentclass[11pt]{article}
               \n\\title{ Title}
                \n\\author{ Author }
                \n\\date{\today}
                \n\\begin{document}
                \n\\maketitle	
                \n\\section{Section 1}
                \n\\pagebreak
                \n\\end{document}`
            }, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(res => { if (res.status == 200 || res.status==201) { navigate("/document/" + res.data['id']) } else { alert("an error has occured") } })
        }
    }
    const handleUpload = async (e) => {

        const id = localStorage.getItem("userId");
        console.log(e.target.files)
         
         const formData = new FormData();
         formData.append('key', e.target.files[0]);
         await axios
             .post(
                 api + "/api/document/zip/"+ localStorage.getItem("userId"),
                 formData,
                 {
                     responseType: "arraybuffer",
                     headers: {
                         "Content-Type": "multipart/form-data",
                     },
                 }
             )
             .then((response) => {
                 if (response.status == 200 || response.status == 201) {
                    console.log(response.data["document"])
                     alert("file uploaded")
                     axios.get(api + "/api/document/user/"+localStorage.getItem("userId"), {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem("token")}`
                        }
                    }).then(
                        response => {
                            if (response.status == 200 || response.status == 201) {
                                console.log(response.data.documents)
                                setRes(response.data.documents)
                                setData(response.data.documents)
                                setChecker(true)
                            } else {
                                localStorage.clear()
                                alert("Please make sure that the file is valid and does not contain any space")
                            }
                        }
                    )
                 }
    
             })
             .catch(function () {
                 alert("check your file")
             })
     }

    return (<>
    <div className="container">
                    <Nav />
                    <br/>
                    <br/>
                    <div >
                        <center>
                          <h1>Welcome to CoffeeTex <FiCoffee /> </h1>
                          <h6>You can start writing in LaTex and generating PDF documents, Word, and Markdown files</h6>
                        </center>
                    </div>
                    <br/>        
            <br />
            </div>
            <br />
            <div className="container second-color">
            <h2>LaTex Documents</h2>
            <p>If you are trying to upload a zip file, please make sure that the file name does not contain any space and that the primary LaTex file is called <strong>main.tex</strong></p>
            <center>
                <div className="row"><div className="column column-60">
                    <input className="float-right" placeholder="Search for document..." onChange={handleChange} />
                </div>
                <div className="column">                    
                <div className="box">

                    <div className ="one">
                

                    </div>
                    <div className="one">
                        <label for="files" class="button button-black float-right file-label">Upload ZIP</label>
                    </div>
                    <div className="one">
                        <input className="hide" id="files" type="file"  onChange={handleUpload} />
                        </div>

                    <div className="one">
                    <button className="button  button-dark  float-left" onClick={handleNew}>New Document</button></div>

                    </div>
                </div>
                    
                  
             
                        
                </div>

                <br />
                <table>
                    <thead><tr>
                        <th>
                            doc_id
                        </th>
                        <th>
                            title
                        </th>
                      
                        <th>
                            edit
                        </th>
                        <th>
                            delete
                        </th>
                    </tr></thead>
                    <tbody>
                        {res.length == 0? <tr> <h4>No document created ...</h4></tr>:res.map(item => (
                            <tr>
                                <td>
                                    {item._id}
                                </td>
                                <td>
                                    {item.title}
                                </td>
                               
                                <td>
                                    <a onClick={() => handleEdit(item._id)}>Click</a>
                                </td>
                                <td>
                                    <a onClick={() => handleDelete(item._id)}>Click</a>
                                </td>
                            </tr>
                        ))}


                    </tbody>
                </table>
            </center>
        <br/>
        <br/>
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
        </div></>
    )
}
export default Browse;