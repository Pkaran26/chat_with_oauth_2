import React from 'react'
import moment from 'moment'
import axios from 'axios'
import FileSaver from 'file-saver'

import { SERVER_URL } from '../../Shared/Urls'

export const LeftMessage = ({ msg, file, created_at })=>{
  return(
    <div className="message messageLeft bg-primary">
      <Message
        msg={ msg }
        file={ file }
        created_at={ created_at }
      />
    </div>
  )
}

export const RightMessage = ({ msg, file, created_at })=>{
  return(
    <div className="message messageRight bg-success">
      <Message
        msg={ msg }
        file={ file }
        created_at={ created_at }
      />
    </div>
  )
}

const downloadFile = (file)=>{
  axios.get(`${ SERVER_URL }/file/${ file.data }`, { responseType: 'blob' })
  .then(blob=>{
    FileSaver.saveAs(blob.data, file.name);
  })
  .catch(err=>{
    console.log(err);
  })
}

const Message = ({ msg, file, created_at })=>(
  <React.Fragment>
    { msg?
      <div>{ msg }</div>
    :null }
    { file?
      <span onClick={ ()=> downloadFile(file) }>
        <img src={ `${ SERVER_URL }/thumb/${ file.thumb }` } style={{ width: '260px' }} alt={ file.thumb } />
      </span>
    :null }
    <div>
      <small>{ moment(created_at).format('DD-MMM-YYYY') }</small>
    </div>
  </React.Fragment>
)
