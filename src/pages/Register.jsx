import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { organizationService } from '../services/api'; // Import organizationService

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    rank: 'white',
    userType: 'individual',
    organizationName: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const dobDate = new Date(formData.dateOfBirth);
      const today = new Date();

      // Check if date is valid
      if (isNaN(dobDate.getTime())) {
        newErrors.dateOfBirth = 'Date of birth must be a valid date';
      }
      // Check if date is in the past
      else if (dobDate >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past';
      }
      // Check if user is at least 13 years old
      else {
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          if (age - 1 < 13) {
            newErrors.dateOfBirth = 'You must be at least 13 years old to register';
          }
        } else if (age < 13) {
          newErrors.dateOfBirth = 'You must be at least 13 years old to register';
        }
      }
    }

    // Rank validation
    const validRanks = ['white', 'blue', 'purple', 'brown', 'black'];
    if (formData.rank && !validRanks.includes(formData.rank.toLowerCase())) {
      newErrors.rank = 'Rank must be one of: white, blue, purple, brown, black';
    }

    // User type validation
    if (!formData.userType || (formData.userType !== 'individual' && formData.userType !== 'organization')) {
      newErrors.userType = 'User type must be either "individual" or "organization"';
    }

    // Organization name validation
    // if (formData.userType === 'organization' && !formData.organizationName.trim()) {
    //   newErrors.organizationName = 'Organization name is required for organization accounts';
    // }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSubmitting(true);
    console.log(submitting);

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);
    console.log(formErrors);

    // If there are errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      setSubmitting(false);
      return;
    }

    // Prepare data for submission (exclude confirmPassword)
    const { confirmPassword, ...registrationData } = formData;

    // console.log(registrationData);

    try {
      // Call register function from AuthContext
      const result = await register(registrationData);

      console.log("result check", {result : result.success, field: result})

      if (result.created) {
        navigate('/login');
      }
      
       else {
        console.log("result", {result});
        
        // Handle backend errors
        if (!result.success && result.field) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [result.field]: result.message
          }));
        } else {
          setGeneralError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        [name]: value
      };

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }

      return newFormData;
    });

    if (name === 'organizationName' && value.trim() !== '') {
      setSubmitting(true); // Disable button while checking
      try {
        const response = await organizationService.checkOrganizationName(value);
        if (!response.isUnique) {
          setErrors(prevErrors => ({
            ...prevErrors,
            organizationName: 'Organization name already exists.'
          }));
        } else {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.organizationName;
            return newErrors;
          });
        }
      } catch (error) {
        setErrors(prevErrors => ({
          ...prevErrors,
          organizationName: error.message || 'Error checking organization name.'
        }));
      } finally {
        setSubmitting(false); // Enable button after check
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Register</h3>
            </div>
            {generalError && <div className="alert alert-danger">{generalError}</div>}
            <div className="card-body d-flex w-100">
              

              <form onSubmit={handleSubmit} className="w-100 mt-4">
                {/*<div className="row">*/  }
                  {/* Name */}
                  <div className="d-flex px-5 mx-5">
                  <div className='w-50'>
                    <div className='mb-4'>
                       <label htmlFor="name" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Name *</label>
                    </div>
                    <div className='mb-4 '>
                      <label htmlFor="dateOfBirth" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Date of Birth</label>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor="rank" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Rank</label>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor="email" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Email *</label>

                    </div>
                    <div className='mb-4'>
                      <label htmlFor="password" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Password *</label>
                    </div>
                    <div className='mb-4 mt-4 pt-4'>
                       <label htmlFor="confirmPassword" className="form-label w-100 text-end pe-3 mt-2 fw-bold">Confirm Password*</label>
                    </div>
                    <div className='mb-4'>
                        <label className="form-label w-100 text-end pe-3 mt-2 fw-bold">User Type *</label>
                    </div>
                    <div className={`mb-4 ${formData.userType === 'organization' ? '' : 'd-none'}`}>
                        <label className="form-label w-100 text-end pe-3 mt-1 fw-bold">Organization Name</label>
                    </div>

                  </div>
                   <div className="w-70">
                  
                  <div className="mb-spe-4">
                   
                    <input
                      type="text"
                      className={`form-control${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                    {/* Date of Birth */}
                    <div className="mb-spe-4">
                    
                    <input
                      type="date"
                      className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                  </div>
                  {/* Rank */}
                  <div className="mb-spe-4">
                    
                    <select
                      className={`form-select ${errors.rank ? 'is-invalid' : ''}`}
                      id="rank"
                      name="rank"
                      value={formData.rank}
                      onChange={handleChange}
                    >
                      <option value="white">White</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="brown">Brown</option>
                      <option value="black">Black</option>
                    </select>
                    {errors.rank && <div className="invalid-feedback">{errors.rank}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-spe-4">
                    
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <div className={`invalid-feedback invalid-container ${errors.email ? 'visible' : 'invisible'}`}>
  {errors.email || ' '}
</div>
                  </div>

                  {/* Password */}
                  <div className="mb-spe-4">
                    
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    <small className="form-text text-muted">Password must be at least 6 characters</small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-spe-4 ">
                   
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>

                

                  

                  {/* User Type */}
                  <div className="mb-spe-4 d-flex justify-content-between align-items-center pt-2 px-4">
                    
                    <div className={`form-check me-4 ${errors.userType ? 'is-invalid' : ''}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="userTypeIndividual"
                        name="userType"
                        value="individual"
                        checked={formData.userType === 'individual'}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="userTypeIndividual">
                        Individual
                      </label>
                    </div>
                    <div className={`form-check ${errors.userType ? 'is-invalid' : ''}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="userTypeOrganization"
                        name="userType"
                        value="organization"
                        checked={formData.userType === 'organization'}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="userTypeOrganization">
                        Organization
                      </label>
                    </div>
                    {errors.userType && <div className="invalid-feedback">{errors.userType}</div>}
                  </div>
                  <div className={`mb-spe-4 ${formData.userType === 'organization' ? '' : 'd-none'}`}>
                    
                    <input
                      type="text"
                      className={`form-control ${errors.organizationName ? 'is-invalid' : ''}`}
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                    />
                    {errors.organizationName && <div className="invalid-feedback">{errors.organizationName}</div>}
                  </div>

                  
                
                 
                  { /*</div>*/}
                  <div className="mt-3 text-center">
                  <Link to="/login"> Already Have An Account Login</Link>
                    </div>

                <div className="d-grid gap-2 mt-4 d-flex">
                  <button className="btn btn-secondary disabled ms-auto">Cancel</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    // disabled={submitting || Object.keys(errors).length > 0} // Disable if submitting or if there are any errors
                  >
                    {submitting ? 'Creating Account...' : 'Create Account +'}
                  </button>
                </div>
                </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
