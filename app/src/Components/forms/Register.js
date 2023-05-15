import React, {useState} from "react";
import classes from './Register.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';
import { registerSchema } from '../../schemas/index';
import { Link } from "react-router-dom";

const onSubmit = (values, actions) => {
    actions.resetForm();
};

const Register = (props) => {

    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setPasswordIsVisible((prevState) => !prevState);
      };


    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            user_name: "",
            email: "",
            password: "",
        },
        validationSchema: registerSchema,
        onSubmit,
    });

    const btnClass = `${classes.btn} ${classes['btn-primary']}`;
 
    // these variables just for controlling the css classes added to the elements
    // const emailInputClasses = emailInputHasError ? `${classes['form-group']} ${classes.invalid}` : `${classes['form-group']}`;
    // const passwordInputClasses = passwordInputHasError ? `${classes['form-group']} ${classes.invalid}` : `${classes['form-group']}`;
    return (
        <div className={classes['register-form']}>

            <div className="d-flex justify-content-end">
                <button className={classes.showIcon} onClick={props.onClick}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </div>

            <div className="mb-5">
                <h2 className={classes.sign}>Create an account</h2>
            </div>

            <form onSubmit={formik.handleSubmit} className={classes['login-form']}>

                <div className="mb-4">
                    <label htmlFor="first_name">First name</label>
                    <input value={formik.values.first_name} type="text" className={classes['form-control']} id="first_name" placeholder="First Name" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {(formik.errors.first_name && formik.touched.first_name) && <p className={classes['error-text']}>{formik.errors.first_name}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="last_name">Last name</label>
                    <input value={formik.values.last_name} type="text" className={classes['form-control']} id="last_name" placeholder="Last Name" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {(formik.errors.last_name && formik.touched.last_name)   && <p className={classes['error-text']}>{formik.errors.last_name}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="user_name">User name</label>
                    <input value={formik.values.user_name} type="text" className={classes['form-control']} id="user_name" placeholder="User Name" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {(formik.errors.user_name && formik.touched.user_name)   && <p className={classes['error-text']}>{formik.errors.user_name}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email">Email address</label>
                    <input value={formik.values.email} type="email" className={classes['form-control']} id="email" placeholder="Enter email" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {(formik.errors.email && formik.touched.email)   && <p className={classes['error-text']}>{formik.errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <div className={classes.password}>
                        <input value={formik.values.password} type={passwordIsVisible ? 'text' : 'password'} className={classes['form-control']} id="password" placeholder="Password" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                        <button className={classes.showIcon} onClick={togglePasswordVisibility}>
                            {passwordIsVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </button>
                    </div>
                    {(formik.errors.password && formik.touched.password)  && <p className={classes['error-text']}>{formik.errors.password}</p>}
                </div>

                <button type="submit" className={btnClass}>CREATE AN ACCOUNT</button>
            </form>

            <footer className={classes['login-form-footer']}>
                <p>Already have an account? <Link onClick={props.onViewHandler}>Sign In</Link></p>
            </footer>

        </div>
        
      );
};

export default Register;