import { Session, ISODateString} from 'next-auth';

export interface CustomSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: number | null
  },
  expires: ISODateString
}