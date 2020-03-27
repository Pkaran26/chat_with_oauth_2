import { ObjectId } from "mongodb";

export interface Message = {
  msg_from: string,
  msg_to: string,
  msg: string,
  created_at: date
}

export interface Conversation = {

}
