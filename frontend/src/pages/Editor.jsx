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
import 'brace/ext/searchbox';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import FileSaver from "file-saver";
//import '../assets/tmp.css';
import "../assets/editor.css"
import useWindowDimensions from "../components/windowDimensions.jsx";
import { compile } from "path-to-regexp";

const Editor = () => {
    const [isUploading, setUploading] = useState(true);
    const [aceSeed, setAceSeed] = useState(1)
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState([]);
    const [fileUrl, setFileUrl] = useState(null);
    const [content, setContent] = useState();
    const [checker, setChecker] = useState(false);
    const [seed, setSeed] = useState(1)
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState([])
    const [fileContents, setFileContents] = useState([{}])
    const [currentFile, setCurrentFile] = useState(["main.tex", 0])
    const [logs, setLogs] = useState("");
    const [clicked, setClicked] = useState(false)
    const [fullList, setFullList] = useState([])
    const [listClicked, setListClicked] = useState(false)
    const [changed, setChanged] = useState(false)
    const navigate = useNavigate()
    const api = "https://backend.coffeetex.co";
    let { id } = useParams();
    const [ids, setIds] = useState(id)
    useEffect(() => {
        if (localStorage.getItem("token") == undefined) {
            navigate("/login")
        } else {
            if (checker == false) {
                Compile();

                setChecker(true);
            }
        }
        document.addEventListener('keydown', handleCtrl);
        return () => {
            document.removeEventListener('keydown', handleCtrl);
        }


    })

    const handleList = (del) => {
        axios.get(api + "/api/document/listfiles/" + id).then(async res => {
            if (res.status == 200 || res.status == 201) {
                console.log(res.data)
                setFullList(res.data['files'].slice(1))
                if (!del) {
                    setListClicked(!listClicked)

                }
            }
        })
    }
    const handleDelete = async (item) => {
        //var ls = item.split(' ')
        //var deleteName = ls[ls.length -1]
        var deleteName = item.filename
        await axios.post(
            api + "/api/document/deletefile/" + id,
            {
                "name": deleteName
            }).then(res => { if (res.status == 200 || res.status == 201) { alert(deleteName + " file deleted"); handleList(true); loadFiles() } else { alert("check the name of the file") } })

    }
    const handleCtrl = (e) => {
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            console.log("pressed ctrl + s")
            Compile()
        }
    }
    const loadFiles = () => {
        axios.get(api + "/api/document/ls/" + id, {
            headers: {
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        }).then(async res => {
            if (res.status == 200 || res.status == 201) {

                const data = []
                const filenames = []
                console.log(res.data["files"])
                for (var i in res.data["files"]) {


                    for (var item in res.data["files"][i]) {
                        var tmp = {}
                        console.log(item)
                        filenames.push(item)
                        tmp[item] = res.data["files"][i][item]
                        //alert(JSON.stringify(tmp))

                        data.push(tmp)
                        // console.log(fileContents)

                    }
                }
                setFiles(filenames)
                setFileContents(data);
                console.log(filenames)
                console.log(fileContents)
                if (checker == false) {
                    setCurrentFile([filenames[0], 0])
                }




                //console.log(currentFile)
            }
        })
    }

    function onChange(newValue) {
        console.log(fileContents)
        setFileContents(prevList => {
            prevList[currentFile[1]][currentFile[0]] = newValue;
            return prevList

        })
        //setFileContents(fileContents => ({... fileContents, }))
    }
    const handleUpload = async (e) => {



        const formData = new FormData();
        formData.append('key', e.target.files[0]);
        if (file) {

            setUploading(true)
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
            setUploading(false)
        }
    }
    const Compile = async () => {
        setUploading(true)

        await axios.post(
            api + "/api/document/save/" + id,
            {
                "files": fileContents
            }, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }
        ).then(res => { if (res.status == 200 || res.status == 201) { console.log(res.status); loadFiles(); } else { alert("LaTex code compiled but not saved") } })

        axios.get(api + "/api/document/compile/" + id, {

            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            var file = new Blob([res.data], { type: 'application/pdf' })
            var fileUrl = URL.createObjectURL(file);
            setFileUrl(fileUrl)
            console.log(fileUrl)
            setSeed(Math.random())
            if (res.status == 200 || res.status == 201) {
                setUploading(false)

            } else {
                alert("internal server error")


            }
        }).catch(function () {
            alert("check your latex code")
        })
    }
    const handleTitle = (e) => {
        setTitle(e.target.value)
    }
    const getLogs = async () => {
        axios.get(api + "/api/document/log/" + id).then(res => {
            setLogs(res.data["log"])
            setClicked(!clicked)
        })
    }

    const addFile = async () => {
        var name = prompt("Enter the LaTex or bib file name")
        await axios.post(
            api + "/api/document/addfile/" + id, {
            name: name
        }
        ).then(res => {
            if (res.status == 200) {
                loadFiles()
            }
        })
    }
    const Docx = async () => {
        await axios.get(
            api + "/api/document/latexdocx/" + id, {
            responseType: "arraybuffer",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        ).then((res) => {
            var file = new Blob([res.data])
            FileSaver.saveAs(file, `document_${id}.docx`)
        })
    }
    const download = () => {
        if (fileUrl != null) {
            window.open(fileUrl)
        }
    }
    function onDocumentLoadSuccess(numPages) {
        console.log(numPages)
        setNumPages(numPages);
    }

    const handleClick = (f, i) => {
        console.log(f)
        setChanged(true)
        setAceSeed(Math.random());

        setCurrentFile([f, i])
    }
    return (
        <div>
            <div className="container" >
                <Nav />

            </div>
            <div className="row" >
                <div className="column">

                    <div className="container editor-c">

                        <div className=" container second-color">
                            <br />
                            <div className="box" >


                                <div className="one">
                                    <button className="button button-black float-left" onClick={Compile} >Run</button>
                                </div>
                                <div className="one">
                                    <button className="button button-light" onClick={download} >PDF</button>
                                </div>
                                <div className="one">
                                    <button className="button button-black" onClick={addFile} >create</button>
                                </div>
                                <div className="one"> <div className="container first-color"><small>id:{ids} </small></div></div>
                                <div className="one">
                                    <label for="files" class="button button-light float-right file-label">Upload</label>
                                </div>
                                <div className="one">
                                    <input className="hide" id="files" type="file" onChange={handleUpload} />
                                </div>
                                <div className="one">
                                    <button className="button button-black " onClick={Docx} >docx</button>
                                </div>
                                <div className="one">
                                    <button className="button button-light" onClick={loadFiles} >Load</button>
                                </div>
                            </div>
                        </div>

                        <div className="box">
                            <div className="one">
                                Files: {files.map((f, i) => <><button className="button button-black button-clear" onClick={() => { handleClick(f, i) }}>{f}</button> </>)}

                            </div>
                            <div className="one">
                                <button className="button button-black button-clear float-right" onClick={() => { handleList(false) }}>List and delete files</button>
                            </div>

                            <div className="one">
                                <button className="button button-black button-clear float-right" onClick={getLogs}>show Logs</button>
                            </div>
                        </div>

                        <div className="second-color">
                            <AceEditor
                            key={aceSeed}
                                mode="latex"
                                theme="solarized_light"
                                onLoad={editor => {
                                    editor.once("change", function () {
                                        editor.session.getUndoManager().reset();
                                    });
                                    console.log("onload ...")


                                }}
                                onChange={(newValue) => { onChange(newValue); }}
                                fontSize={14}
                                lineHeight={17}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                editorProps={{ $blockScrolling: true }}
                                height="75vh"
                                width="100%"
                                value={fileContents[currentFile[1]][currentFile[0]]}
                                enableBasicAutocompletion={true}
                                enableLiveAutocompletion={true}
                                enableSnippets={true}
                                UseWrapMode={true}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    enableMobileMenu: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                    wrap: true,

                                }}

                            />


                        </div>

                    </div>
                </div>
                <div className="column">

                    <div className="container">
                        {clicked == true && listClicked == false ? <><br /><h4>Logs: </h4> <br /><div className="second-color log">  <p>{logs}</p></div></>
                            : listClicked == true ? <div className="log container second-color"><br /><h4>Files: (Click to delete) </h4> <br /><div className=" container first-color"> <strong>Date        Filename </strong></div> <br />{fullList.map(item => (<div className="container first-color" onClick={() => { handleDelete(item) }}> <p>{item.date}  {item.filename}</p> </div>))}</div>:
                                <> {isUploading == true ? <><br /> <br /><div className="container second-color">Please wait, we are compiling your LaTex file ...</div></> : <Sample file={fileUrl} key={seed} />}
                                </>
                        }

                            </div>
                </div>
                </div>
            </div>
            )
}
            export default Editor;