import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import './Sample.css';
import '../assets/editor.css'
import type { PDFDocumentProxy } from 'pdfjs-dist';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

function Sample({file}) {
  const [numPages, setNumPages] = useState();
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();
  const [page, setPage] = useState(1);
  const [scale, setScale]= useState(1.1)
  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    console.log(nextNumPages)
    setNumPages(nextNumPages);
  }
  const Next=() =>{
       if (page < numPages ){
        setPage(page + 1)
       }else{
        setPage(1)
       }
       
  }
  const Back = () =>{
    if (page >1){
      setPage(page - 1)
    }else{
      setPage(numPages)
    }
  }
  const Zoom = (checker)=>{
    if (checker == false){
      setScale(scale - 0.1)
    }else{
     if (scale < 1.1){
      setScale(scale + 0.1)
     }
 
    }
  }
  

  return (
    <div className="Example ">
      <div className="Example__container">
        <div className="Example__container__document" ref={setContainerRef}>
          <div className='wrap'>
          <div className='container second-color'>
            <br/>
         <div className='box'>
         
          <div className='one'>
            <button className='button button-dark float-left' onClick={()=>{Zoom(true)}}>Zoom in</button>
          </div>
          <div className='one'>
            <button className='button button-light  float-left' onClick={()=>{Zoom(false)}}>Zoom out</button>
          </div>
          <div className='one'>
            <div className='container first-color'>
              <center>
           <p>Page <strong>{page}</strong> of <strong>{numPages}</strong></p>
           </center>
           </div>
          </div>
          <div className='one'>
            <button className='button button-dark float-right' onClick={Back}>Back</button>
          </div>
          <div className='one'>
            <button className='button button-light float-right' onClick={Next}>Next</button>
          </div>
         </div>
         
         </div>
         <main>
          <Document file= {file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
      
              <Page
                key={`page_${page}`}
                pageNumber={page}
                width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                scale = {scale}
              />
          
          </Document>
          </main>
        </div>
        </div>
      </div>
    </div>
  );
}
export default Sample;