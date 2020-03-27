import moment from 'moment';
import { ObjectId } from "mongodb";
import { DBPool } from "../Utils/DBPool";
import { User } from "./Interface";

export class UserView {
  private user: string = 'user';

  async createUser(payload: User, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const user = await db.collection(this.user).findOne({
          email: payload.email
        })
        if(user){
          callback(user);
        }else{
          const res = await db.collection(this.user).insertOne({
            ...payload,
            created_at: moment().format('YYYY-MM-DD'),
          });
          callback(res.ops[0]);
        }
      });
    } catch (err) {
      callback(null);
      console.log(err);
    }
  }

  async userList(callback: Function){
    try {
      DBPool( async (db: any)=>{
        callback( await db.collection(this.user).aggregate([
          { $sort: { created_at: -1} },
           { $project: { password: 0 } }
        ])
        .toArray()
        .catch((err: any)=>{  }) )
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
