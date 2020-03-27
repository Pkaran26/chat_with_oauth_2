import moment from 'moment';
import { ObjectId } from "mongodb";
import { DBPool } from "../Utils/DBPool";
import { Message } from "./Interface";
import { User } from "../User/Interface";

export class ChatView {
  private messages: string = 'messages';
  private user: string = 'user';

  async submitMessage(payload: any, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.messages).insertOne({
          ...payload,
          msg_from: new ObjectId(payload.msg_from),
          msg_to: new ObjectId(payload.msg_to),
        })
        .catch((err: any)=>{  })
        callback(res);
      });
    } catch (err) {
      callback(null);
      console.log(err);
    }
  }

  async getSingleConversationS(msg_from: string, msg_to: string, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.messages).aggregate([
        { $match: { $or: [
            { $and: [
                { msg_from: new ObjectId(msg_from) },
                { msg_to : new ObjectId(msg_to) }
              ]
            },
            { $and: [
                { msg_to: new ObjectId(msg_from) },
                { msg_from : new ObjectId(msg_to) }
              ]
            }
            ]
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()
      .catch((err: any)=>{  })
        callback(res);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
