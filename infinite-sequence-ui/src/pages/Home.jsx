import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Infinite Sequence </h1>
        <p className="lead">
         
        </p>
        <hr className="my-4" />
       
        {!isAuthenticated ? (
          <div className="mt-4">
            <Link to="/login" className="btn btn-primary me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <Link to="/flow-editor" className="btn btn-success">
              Go to Flow Editor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
