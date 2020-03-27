import { Request, Response, Router } from 'express';
import { UserView } from './Controllers';

const UserRouters = Router();
const _userView: UserView = new UserView();

UserRouters.post('/create', async (req: Request, res: Response)=>{
  await _userView.createUser(req.body, (result: any)=>{
  //  console.log(result);
    res.json(result);
  });
})

export default UserRouters;
