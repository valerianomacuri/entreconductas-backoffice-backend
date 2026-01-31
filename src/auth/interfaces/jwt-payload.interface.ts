// JwtPayload standardizes the shape of tokens issued and consumed by the app.
export type UserRole = 'admin' | 'manager';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
