import React, { useState } from 'react'

const FileSelectors = ({ close, prepareFile })=>{
  const [fileSelected, setFileSelected] = useState(false)
  const [file, setFile] = useState([])

  const selectFile = (e)=>{
    if(e.target.files && e.target.files.length>0){
      setFile(e.target.files[0]);
      setFileSelected(true)
    }
  }

  const inputArray = [
    {
      id: "imageUpload",
      label: 'Image',
      accept: ".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*",
      iconClass: "fa fa-file-image-o"
    },
    {
      id: "videoUpload",
      label: 'Video',
      accept: ".avi, .mp4, .3gp|video/*",
      iconClass: "fa fa-file-video-o"
    },
    {
      id: "audioUpload",
      label: 'Audio',
      accept: ".mp3, .wav, .ogg|audio/*",
      iconClass: "fa fa-file-audio-o"
    },
    {
      id: "documentUpload",
      label: 'Document',
      accept: ".doc, .docx, .xls, .xlsx, .txt|document/*",
      iconClass: "fa fa-file-text-o"
    }
  ]

  return(
    <div className="shadow">
      <div className="modal show" style={{display: "block"}} id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{fileSelected? 'Preview': 'Select File'}</h4>
              <button type="button" className="close" onClick={close} data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body text-center">
            {fileSelected?
              <FilePreview
                file={file}
                prepareFile={prepareFile}
              />
            :
              <SelectorList
                inputArray={inputArray}
                selectFile={selectFile}
              />
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SelectorList = ({ inputArray, selectFile })=>{
  return(
    <ul className="attachmentSelector">
      {inputArray.map((e, i)=>(
        <li key={i}>
          <label htmlFor={e.id}>
            <i className={e.iconClass} aria-hidden="true"></i>
            <br/>
            <small>{e.label}</small>
            <input type="file" accept={e.accept} id={e.id} onChange={selectFile} style={{display:"none"}} />
          </label>
        </li>
      ))}
    </ul>
  )
}

const FilePreview = ({ file, prepareFile })=>{
  const { name, size } = file
  return(
    <div>
      <p>{ name }</p>
      <small>{ size/1000 }kb</small>
      <hr/>
      <button type="button" className="btn btn-primary" onClick={()=> prepareFile(file)}>Send</button>
    </div>
  )
}

export default FileSelectors
