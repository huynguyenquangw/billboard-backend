import { Request } from 'express';
import { User } from 'src/modules/api/users/user.entity';

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;
