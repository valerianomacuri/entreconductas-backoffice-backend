// JwtPayload standardizes the shape of tokens issued and consumed by the app.
import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
