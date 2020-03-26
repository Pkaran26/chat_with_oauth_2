import React from 'react'
import moment from 'moment'
//import fileIcon from '../../../images/file.png'
import LazyLoad from 'react-lazy-load'
import { ServerUrl } from '../../../Utils/Urls'
import axios from 'axios'
import { saveAs } from 'file-saver'

const DisplayChat = ({ messages, receiver })=>{
  return(
    <div>
      {messages && messages.length>0?
        messages.map((e, i)=>{
          if(e.receiver !== receiver){
            return(
              <LeftChat
                key={i}
                e={e}
              />
            )
          }else {
            return(
              <RightChat
                key={i}
                e={e}
              />
            )
          }
        })
      :null}
    </div>
  )
}

const LeftChat = ({ e })=>{
  return(
    <div className="clearfix">
      <div className="chat leftchat bg-warning">
        <Chat
          e={e}
          side="left"
        />
      </div>
    </div>
  )
}

const RightChat = ({ e })=>{
  return(
    <div className="clearfix">
      <div className="chat rightchat bg-info">
        <Chat
          e={e}
          side="right"
        />
      </div>
    </div>
  )
}

const Chat = ({ e: { _id, receiver, message, datetime, file, thumb, message_status: { sent, received } }, side })=>{
  const downloadFile = (filename)=>{
    axios.get(`${ServerUrl}download/original/${filename}`, {
      responseType: 'blob'
    }).then(res=>{
       saveAs(res.data, filename)
    }).catch(err=>{
      console.log(err);
    })
  }
  return(
    <div>
      <p>
        <strong>{ receiver }</strong>
      </p>
      <div style={{padding: "5px"}}>
        {file && thumb?
          <div style={{cursor: 'pointer'}} onClick={()=>{
            downloadFile(file.name)
          }}>
          {!sent?
            <div className="spinner-border text-white"></div>
          :
            <LazyLoad height={150} offsetVertical={300}>
              <img style={{width: "150px", height: "150px"}} src={`${ServerUrl}download/thumb/${thumb.name}`} alt={datetime} />
            </LazyLoad>
          }
            <br/>
            <span>{ file.name }</span>
            <br/>
            <span>{ file.size/1000 }kb</span>
          </div>
        :
          <p>{ message }</p>}
      </div>
      <p style={{textAlign: 'right'}}>
        {side === "right"?
          sent?
            received?
            <React.Fragment>
              <i className="fa fa-check" aria-hidden="true"></i>
              <i className="fa fa-check" style={{marginLeft: '-9px'}} aria-hidden="true"></i>
            </React.Fragment>
            :
            <i className="fa fa-check" aria-hidden="true"></i>
          :
          <i className="fa fa-clock-o" aria-hidden="true"></i>
        :null}
        <small> { moment(datetime).format('DD-MMM-YYYY hh:mm A') }</small>
      </p>
    </div>
  )
}
export default DisplayChat
