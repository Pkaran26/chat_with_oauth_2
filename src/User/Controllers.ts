import moment from 'moment';
import { ObjectId } from "mongodb";
import { DBPool } from "../Utils/DBPool";
import { User } from "./Interface";

export class UserView {
  private user: string = 'user';

  async createUser(payload: User, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.user).insertOne({
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

  async userLogin(payload: any, callback: Function){
    try {
      DBPool( async (db: any)=>{
        const { email, password } = payload;
        const res = await db.collection(this.user).findOne(
          { email: email, password: password },
          { projection: { password: 0 } }
        );
        if(res){
            callback({
              status: true,
              user: res,
            });
        }else{
          callback({ status: false });
        }
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async userList(callback: Function){
    try {
      DBPool( async (db: any)=>{
        const res = await db.collection(this.user).aggregate([
          { $sort: { created_at: -1 } },
          { projection: { password: 0 } }
        ])
        if(res){
            callback({
              status: true,
              user: res,
            });
        }else{
          callback({ status: false });
        }
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
