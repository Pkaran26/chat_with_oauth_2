import moment from 'moment';
import { ObjectId } from "mongodb";
import { DBPool } from "../Utils/DBPool";
import { Message } from "./Interface";
import { User } from "../User/Interface";

export class ChatView {
  private messages: string = 'messages';
  private user: string = 'user';

  async submitMessage(payload: Message, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.messages).insertOne({
          ...payload,
          created_at: moment().format('YYYY-MM-DD'),
        });
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
          { projection: { password: 0 } }
        );
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
        );
        callback(res);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
