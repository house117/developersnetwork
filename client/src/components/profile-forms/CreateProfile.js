import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
    const [formData, setFormData] = useState({
        company: "",
        website: "",
        location: "",
        status: "",
        skills: "",
        githubusername: "",
        bio: "",
        twitter: "",
        facebook: "",
        linkedin: "",
        youtube: "",
        instagram: ""
    });

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history);
    };
    return (
        <Fragment>
            <h1 className="large text-primary">Crea tu perfil</h1>
            <p className="lead">
                <i className="fas fa-user" /> Comparte información para que tu
                perfil destaque entre los demás
            </p>
            <small>
                <b>*</b> = campo requerido
            </small>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <select
                        name="status"
                        value={status}
                        onChange={e => onChange(e)}
                    >
                        <option value="0">
                            * Selecciona tu estatus profesional
                        </option>
                        <option value="Developer">Developer</option>
                        <option value="Junior Developer">
                            Junior Developer
                        </option>
                        <option value="Senior Developer">
                            Senior Developer
                        </option>
                        <option value="Manager">Manager</option>
                        <option value="Student or Learning">
                            Estudiante o aprendiendo
                        </option>
                        <option value="Instructor">
                            Instructor o Profesor
                        </option>
                        <option value="Intern">Interno</option>
                        <option value="Other">Otro</option>
                    </select>
                    <small className="form-text">
                        Danos una idea de dónde te encuentras profesionalmente
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Compañía"
                        name="company"
                        value={company}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Puede ser tu propia compañía o para la cual trabajas
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Sitio web"
                        name="website"
                        value={website}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Puede ser propio o de la empresa para la que trabajas
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Dirección"
                        name="location"
                        value={location}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Ciudad y estado (ej. Oaxaca de Juárez, Oax)
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Skills/Habilidades"
                        name="skills"
                        value={skills}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Usa valores separados por coma (ej.
                        HTML,CSS,JavaScript,PHP)
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Nombre de usuario de GitHub"
                        name="githubusername"
                        value={githubusername}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Si quieres compartir tus últimos repositorios y un link,
                        escribe tu nombre de usuario de GitHub
                    </small>
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Pequeña biografía"
                        name="bio"
                        value={bio}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">
                        Cuéntanos un poco sobre ti
                    </small>
                </div>

                <div className="my-2">
                    <button
                        onClick={() => toggleSocialInputs(!displaySocialInputs)}
                        type="button"
                        className="btn btn-light"
                    >
                        Agregar links de redes sociales
                    </button>
                    <span>Opcional</span>
                </div>
                {displaySocialInputs && (
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x" />
                            <input
                                type="text"
                                placeholder="Twitter URL"
                                name="twitter"
                                value={twitter}
                                onChange={e => onChange(e)}
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x" />
                            <input
                                type="text"
                                placeholder="Facebook URL"
                                name="facebook"
                                value={facebook}
                                onChange={e => onChange(e)}
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-youtube fa-2x" />
                            <input
                                type="text"
                                placeholder="YouTube URL"
                                name="youtube"
                                value={youtube}
                                onChange={e => onChange(e)}
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-linkedin fa-2x" />
                            <input
                                type="text"
                                placeholder="Linkedin URL"
                                name="linkedin"
                                value={linkedin}
                                onChange={e => onChange(e)}
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x" />
                            <input
                                type="text"
                                placeholder="Instagram URL"
                                name="instagram"
                                value={instagram}
                                onChange={e => onChange(e)}
                            />
                        </div>
                    </Fragment>
                )}

                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">
                    Regresar
                </Link>
            </form>
        </Fragment>
    );
};

CreateProfile.propTypes = {
    createProfile: PropTypes.func.isRequired
};

export default connect(
    null,
    { createProfile }
)(withRouter(CreateProfile));
