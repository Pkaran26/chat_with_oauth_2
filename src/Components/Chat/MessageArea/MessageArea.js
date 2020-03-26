import React, { useState, useEffect } from 'react'
import moment from 'moment'
import ScrollToBottom from 'react-scroll-to-bottom'
import axios from 'axios'
import { ServerUrl } from '../../../Utils/Urls'
import { Resize } from '../../../Utils/Image'
import attachment from '../../../images/attachment.jpeg'
import FileSelectors from '../UploadModels/FileSelector'
import DisplayChat from './DisplayChat'
import MessageForm from './MessageForm'

const MessageArea = ({ receiverDetails, user, getMessage, messages, userTyping, sendFile, receivedMessage })=>{
  const { receiver, receiver_id, receiver_socket_id, typing } = receiverDetails
  const { user_id, _id } = user
  const [oldMessages, setOldMessages] = useState([])
  const [fileModel, setFileModel] = useState(false)

  useEffect(()=>{
    axios.get(`${ServerUrl}api/chat/${_id}/${receiver_id}`)
    .then((res)=>{
      if(res && res.data && res.data.messages && res.data.messages.length>0 && messages.length === 0){
        setOldMessages(res.data.messages)
      }else {
        setOldMessages([])
      }
    }).catch((err)=>{
      console.error(err);
      setOldMessages([])
    })
  }, [receiver_id, _id, messages])

  useEffect(()=>{
    getMessageId(oldMessages)
  }, [oldMessages])

  useEffect(()=>{
    getMessageId(messages)
  }, [])

  const getMessageId = (messagesArr)=>{
    const filteredArr = messagesArr.filter((e, i)=>{
      return e.message_status.sent && !e.message_status.received
    })
    if(filteredArr && filteredArr.length>0){
      const ids = filteredArr.map((e, i)=>{
        return e._id
      })
      if(ids && ids.length>0){
          receivedMessage({
            receiver_socket_id,
            receiver_id,
            ids
          })
      //  console.log(ids);
      }
    }
  }
  const prepareFile = (file)=>{
    setFileModel(false)
    let payload = {
      receiver,
      receiver_id,
      receiver_socket_id,
      file: '',
      thumb: '',
      message: '',
      sender_socket_id: user_id,
      sender_id: _id,
      message_status: {
        sent: false,
        received: false
      },
      datetime: moment()
    }

    Resize(file, (response)=>{
      payload.file = {
        name: file.name,
        contentType: file.type,
        size: file.size,
        data: response
      }
      payload.thumb = {
        name: file.name,
        contentType: file.type,
        size: file.size,
        data: ''
      }
      sendFile(payload)
    })
  }
  return(
    <React.Fragment>
      {fileModel?
        <FileSelectors
          close={()=>{
            setFileModel(false)
          }}
          prepareFile={prepareFile}
         />
       :null}
      <div className="card bg-light">
        <div className="card-header" style={{position: 'relative'}}>
          <strong>{ receiver }</strong>
          <small>{ typing }</small>
          <img src={attachment} alt="attachment" className="attachmentIcon" onClick={()=> setFileModel(true)} />
        </div>
        <div className="card-body">
          <ScrollToBottom className="chatbox">
            <DisplayChat
              messages={oldMessages}
              receiver={receiver}
            />
            <DisplayChat
              messages={messages}
              receiver={receiver}
            />
          </ScrollToBottom>
          <MessageForm
            getMessage={getMessage}
            receiver={receiver}
            receiver_id={receiver_id}
            sender_socket_id={user_id}
            sender_id={_id}
            receiver_socket_id={receiver_socket_id}
            userTyping={userTyping}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
export default MessageArea
