import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-language_tools";
import Sample from "../components/Render.jsx"
import Nav from '../components/Nav.jsx'
import React, { useEffect, useState } from "react";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-language_tools";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import FileSaver from "file-saver";
import useWindowDimensions from "../components/windowDimensions.jsx";

const Editor =()=>{
 const [numPages, setNumPages] = useState();
 const [pageNumber, setPageNumber] = useState(1);
 const [file, setFile] = useState([]);
 const [fileUrl, setFileUrl] = useState(null);
 const [content, setContent] = useState();
 const [checker, setChecker] = useState(false);
 const [seed, setSeed] = useState(1)
 const [title, setTitle] = useState("")
 const navigate = useNavigate()
 const api = "http://localhost:8000";
 let { id } = useParams();
 const[height, setHeight]= useState("1000px")
 const { h, w } = useWindowDimensions();

 useEffect(() => {
     if (localStorage.getItem("token") == undefined) {
         navigate("/login")
     } else {
         if (checker == false) {
             axios.get(api + "/api/document/" + id, {
                 headers: {
                     "Authorization": `Token ${localStorage.getItem('token')}`
                 }
             }).then(res => {
                 if (res.status == 200 || res.status == 201) {
                     console.log(res.data["document"]["content"])
                     setContent(res.data["document"]["content"]); setTitle(res.data["document"]["title"]);

                     let formData = new FormData()
                     formData.append('file', content)
                     axios.get(api + "/api/document/compile/" + id, {
                         responseType: "arraybuffer",
                         headers: {
                             "Content-Type": "multipart/form-data",
                         },
                     }).then(res => {
                        var file = new Blob([res.data], {type: 'application/pdf'})
                        var fileUrl = URL.createObjectURL(file);
                        setFileUrl(fileUrl)
                        console.log(fileUrl)
                         setSeed(Math.random())
                         setChecker(true);

                     })
                 } else { localStorage.clear(); alert("server error") }
             })
             setHeight(""+h+"px")
         }
     }
 })
 function onChange(newValue) {
     setContent(newValue)
     console.log(content)
 }
 const handleUpload =  async (e) => {
   
    
     
     const formData = new FormData();
     formData.append('key', e.target.files[0]);
     /*fetch(api + "/api/document/upload/" + id, {
        mode: 'cors',
        method: 'POST',
    
        body: formData
      }).then(
        success =>   alert("file uploaded") // Handle the success response object
      ).catch(
        error =>   alert(error) // Handle the error response object
      );
    };*/
 if (file){


      axios
         .post(
             api + "/api/document/upload/" + id,
             formData,
             {
                withCredentials: false,
                 responseType: "arraybuffer",
                 headers: {
                     "Content-Type": "multipart/form-data",
                 },
             }
         )
         .then((response) => {
             if (response.status == 200 || response.status == 201) {
                 alert("file uploaded")
             }

         })
         .catch(function () {
             alert("check your file")
         })
 } }
 const Compile = () => {
     axios.patch(
         api + "/api/document/" + id,
         {
             "title": title,
             "content": content
         }, {
         headers: {
             "Authorization": `Token ${localStorage.getItem("token")}`
         }
     }
     ).then(res => { if (res.status == 200 || res.status == 201) { console.log(res.status) } else { alert("LaTex code compiled but not saved") } })

     axios.get(api + "/api/document/compile/" + id, {
         
         responseType: "blob",
         headers: {
             "Content-Type": "multipart/form-data",
         },
     }).then(res => {
         var file = new Blob([res.data], {type: 'application/pdf'})
         var fileUrl = URL.createObjectURL(file);
         setFileUrl(fileUrl)
         console.log(fileUrl)
         setSeed(Math.random())
         if (res.status == 200 || res.status == 201) {
         } else {
             alert("internal server error")
         }
     })
 }
 const handleTitle = (e) => {
     setTitle(e.target.value)
 }
 const Docx = () => {
     axios.get(
         api + "/api/document/docx/" + id, {
         responseType: "arraybuffer",
         headers: {
             "Content-Type": "multipart/form-data",
         },
     }
     ).then((res) => {
         var file = new Blob([res.data])
         FileSaver.saveAs(file, `document_${id}.docx`)
     }).catch(function () {
         alert("check your latex code")
     })
 }
 const download = () => {
     if (fileUrl != null) {
         window.open(fileUrl)
     }
 }
 function onDocumentLoadSuccess(numPages ) {
    console.log(numPages)
   setNumPages(numPages);}
    return (
        <>
        <div className="container">
        <Nav/>
        </div>
        <div className="row" >
        <div className="column">
            
        <div className="container">          
            
            <br/>
            <div className="second-color">
                <br/>
                <div className="box " >
                 
    
                    <div className="one">
                        <button className="button button-black float-black" onClick={Compile} >Run</button>
                        </div>
                        <div className="one">
                        <button className="button button-black" onClick={download} >PDF</button>
                        </div>
                    
                    <div className="one"><input placeholder="Title of the document" value={title} onChange={handleTitle}  /></div>
                    <div className="one">
                        <label for="files" class="button button-black float-right file-label">Upload</label>
                    </div>
                    <div className="one">
                        <input className="hide" id="files" type="file"  onChange={handleUpload} />
                        </div>
                        <div className="one">
                        <button className="button button-black " onClick={Docx} >docx</button>
                    </div>
                </div>
                </div>
               
          <div className="second-color">
                <AceEditor
                            mode="latex"
                            onChange={onChange}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                            height={height}
                            width="100%"
                            value={content}
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            enableSnippets={true}
                            UseWrapMode= {true}
                            setOptions={{
                                wrap: true,
                               maxLines: 90
                            
                            }}
                            
                        />
            </div>
            </div>
        </div>
        <div className="column">
                    <div className="container">
                    <p>
                    </p>
                 
                 <Sample file ={fileUrl} key={seed}/>
                </div>
                </div>
    </div>
    </>
    )
}
export default Editor;