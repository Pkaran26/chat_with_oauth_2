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

  async getUserConversations(user_id: string, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.user).findMany(
          { _id: new ObjectId(user_id) },
          { $lookup: {
            from: "user",
            localField: "conversations",
            foreignField: "_id",
            as: "conversations",
          } },
          { $project: { password: 0 } }
        )
        .catch((err: any)=>{  })
        callback(res);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getSingleConversationS(user_id: string, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.user).findMany(
          { _id: new ObjectId(user_id) },
          { $lookup: {
            from: "user",
            localField: "msg_from",
            foreignField: "_id",
            as: "msg_from",
          } },
          { $lookup: {
            from: "user",
            localField: "msg_to",
            foreignField: "_id",
            as: "msg_to",
          } },
          { $sort: { created_at: -1 } }
        )
        .catch((err: any)=>{  })
        callback(res);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
