import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Nav from '../components/Nav.jsx';
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

    return (<>
    <div className="container">
                    <Nav />
                    <br/>
                    <br/>
            <blockquote>
                <p><em>edit, view and create LaTex documents online </em></p>
            </blockquote>
        
            <br />
            </div>
            <br />
            <div className="container second-color">
            <h2>documents</h2>
            <center>
                <div className="row"><div className="column column-60">
                    <input className="float-right" placeholder="Search for document..." onChange={handleChange} />
                </div>
                <div className="column">                    
                <div className="box">

                    <div className ="one">
                    <label for="files" class="button button-black  file-label">PDF Upload</label>
                    <input className="hide" id="files" type="file"  onChange={generateText} />

                    </div>


                    <div className="one">
                    <button className="button  button-dark  float-left" onClick={handleNew}>New Document +</button></div>

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
        </div></>
    )
}
export default Browse;