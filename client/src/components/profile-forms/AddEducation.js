import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation, history }) => {
    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldofstudy: "",
        from: "",
        to: "",
        current: false,
        description: ""
    });

    const [toDateDisabled, toggleDisabled] = useState(false);
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <Fragment>
            <h1 class="large text-primary">Agregar educación</h1>
            <p class="lead">
                <i class="fas fa-code-branch" /> Agrega cualquier escuela,
                certificación, diplomado, al cual hayas asistido o asistas
                actualmente.
            </p>
            <small>
                <b>*</b> = campo requerido
            </small>
            <form
                class="form"
                onSubmit={e => {
                    e.preventDefault();
                    addEducation(formData, history);
                }}
            >
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* Escuela/diplomado/certificación"
                        name="school"
                        value={school}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* Grado obtenido o certificado"
                        name="degree"
                        value={degree}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="Campo de estudio"
                        name="fieldofstudy"
                        value={fieldofstudy}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div class="form-group">
                    <h4>Desde</h4>
                    <input
                        type="date"
                        name="from"
                        value={from}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div class="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            checked={current}
                            value={current}
                            onChange={e => {
                                setFormData({ ...formData, current: !current });
                                toggleDisabled(!toDateDisabled);
                            }}
                        />{" "}
                        Actual escuela/certificación/diplomado
                    </p>
                </div>
                <div class="form-group">
                    <h4>Hasta</h4>
                    <input
                        type="date"
                        name="to"
                        value={to}
                        onChange={e => onChange(e)}
                        disabled={toDateDisabled ? "desactivado" : ""}
                    />
                </div>
                <div class="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Descripción"
                        value={description}
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <a class="btn btn-light my-1" href="dashboard.html">
                    Regresar
                </a>
            </form>
        </Fragment>
    );
};

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
};

export default connect(
    null,
    { addEducation }
)(withRouter(AddEducation));
