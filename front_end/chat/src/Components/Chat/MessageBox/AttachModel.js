import React, { useState } from 'react'
import moment from 'moment'

const AttachModel = ({ returnAttach, close })=>{
  const [files, setFiles] = useState([])

  const handleFile = (e)=>{
    if(e.target.files && e.target.files.length>0){
      let temp = files
      let file = e.target.files[0]
      createBuffer(file, (buffer)=>{
        const payload = {
          name: `${ moment().format('DD-MMM-YY_hh-mm_A') }_${ file.name }`,
          contentType: file.type,
          size: file.size,
          data: buffer,
          thumb: ''
        }
        temp = [...temp, payload]
        setFiles(temp)
      })
    }
  }

  const createBuffer = ( file, callback )=>{
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (evt) => {
      var arrayBuffer = fileReader.result;
      callback(arrayBuffer)
    }
  }

  const bufferTobase64 = (e)=>{
    const buffer = btoa(String.fromCharCode(...new Uint8Array(e.data)))
    return `data:${e.contentType };base64,${ buffer }`
  }

  const sendFile = ()=>{
    if(files && files.length>0){
      returnAttach(files)
      close()
    }
  }

  return(
    <div className="shadow">
      <div className="modal show" style={{ display: 'block', top: '80px'}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Attachment</h5>
            <button type="button" className="close" onClick={ close }>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            { files && files.length>0?
              files.map((e, i)=>(
                <img src={ bufferTobase64(e) } style={{
                  width: '140px',
                  height: '140px',
                  marginRight: '5px'
                }} class="img-thumbnail" alt={ e.name } />
              ))
            :null }
            { files && files.length < 6?
              <React.Fragment>
                <label for="inputGroupFile02" className="btn btn-secondary" style={{
                  width: '140px',
                  height: '140px',
                  paddingTop: '47px',
                  fontSize: '30px'
                }}>
                  <i className="fas fa-plus"></i>
                </label>
                <input type="file" onChange={ handleFile } style={{ opacity: 0}} id="inputGroupFile02" />
              </React.Fragment>
            :null  }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={ sendFile }>Attach File</button>
            <button type="button" className="btn btn-secondary" onClick={ close }>Close</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default AttachModel
