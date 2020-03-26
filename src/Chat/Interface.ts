import { ObjectId } from "mongodb";

export interface Message = {
  msg_from: ObjectId,
  msg_to: ObjectId,
  msg: string,
  created_at: date
}

export interface Conversation = {

}
