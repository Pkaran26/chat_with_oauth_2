import { ObjectId } from "mongodb";

export interface User {
  name: string,
  email: string,
  //phone_number: string,
  //password: string,
  conversations: ObjectId[],
  created_at: date
}
