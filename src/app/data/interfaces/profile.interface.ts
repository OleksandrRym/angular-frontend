export interface Profile {
  id: number,
  username: string,
  avatarUrl: string | null,
  subscriptionsAmount: number,
  firstName: string,
  lastName: string,
  isActive: boolean,
  stack: string[],
  city: string,
 }
