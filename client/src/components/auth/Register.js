import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });
    const { name, email, password, password2 } = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("Las contraseñas no coinciden", "danger");
        } else {
            register({ name, email, password });
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Registro</h1>
            <p className="lead">
                <i className="fas fa-user" /> Crea tu cuenta
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="name"
                        value={name}
                        onChange={e => onChange(e)}
                        //required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        //required
                    />
                    <small className="form-text">
                        Este sitio utiliza Gravatar, si quieres una imagen de
                        perfil, utiliza un email con Gravatar
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        //minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                        //minLength="6"
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Registrarse"
                />
            </form>
            <p className="my-1">
                Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});
export default connect(
    mapStateToProps,
    { setAlert, register }
)(Register);
