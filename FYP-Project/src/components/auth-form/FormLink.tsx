
import { Link } from 'react-router-dom';

interface FormLinkProps {
  method: string;
}

export const FormLink: React.FC<FormLinkProps> = ({ method }) => (
  <div className="text-center mt-4 text-gray-300">
    {method === 'login' ? "Don't have an account? " : 'Already have an account? '}
    <Link
      to={method === 'login' ? '/register' : '/login'}
      className="text-red-600 hover:text-darkredhover"
    >
      {method === 'login' ? 'Register here' : 'Login here'}
    </Link>
  </div>
);