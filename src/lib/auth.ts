import { auth } from './better-auth';
import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    
    if (!session) return null;
    
    return { 
      user: { 
        id: session.user.id, 
        name: session.user.name, 
        email: session.user.email, 
        image: session.user.image 
      } 
    };
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}

export { auth };
