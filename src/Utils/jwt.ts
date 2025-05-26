import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  user_id: number;
  exp: number;

}

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.user_id;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}
