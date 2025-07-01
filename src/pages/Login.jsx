import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const response = await login(email, password);
    if (response.success) {
      console.log("success", response.success);
      navigate("/flow-viewer");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card ">
            
            <div className="card-body mt-5">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit} className="">
                <div className="d-flex px-5 mx-5">
                  <div className="w-30">
                    <div>
                      <label htmlFor="email" className="form-label w-100 text-end pe-3 mt-2 fw-bold" style={{marginBottom: "62px"}}>
                      Email
                    </label>

                    </div>
                    <div>
                      <label htmlFor="password" className="form-label w-100 text-end pe-3 fw-bold">
                      Password
                    </label>
                      
                    </div>
                    
                    

                  </div>
                  <div className="w-70">

                  
                  <div className="mb-3">
                    
                    <input
                      type="email"
                      className={`form-control mb-5 ${error ? 'is-invalid' : ''}`}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    
                    <input
                      type="password"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <a href="#" className="mx-auto">Forgot password ?</a>
                  </div>
                  
                  </div>
                </div>
                <div className="d-flex">
                  <div className="d-flex ms-auto">
                    <button type="button" className="btn btn-secondary mx-2">
                      Cancel
                    </button>

                  </div>
                    <button type="submit" className="btn btn-primary mx-2">
                      Login
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
