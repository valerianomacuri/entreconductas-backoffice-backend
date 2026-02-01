// JwtPayload standardizes the shape of tokens issued and consumed by the app.
export type UserRole = 'admin' | 'manager';

export interface JwtPayload {
  sub: string;
  role: {
    id: string;
    name: UserRole;
    modules: string[];
  };
}
