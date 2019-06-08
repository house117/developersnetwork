import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience, history }) => {
    const [formData, setFormData] = useState({
        company: "",
        title: "",
        location: "",
        from: "",
        to: "",
        current: false,
        description: ""
    });

    const [toDateDisabled, toggleDisabled] = useState(false);
    const {
        company,
        title,
        location,
        from,
        to,
        current,
        description
    } = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <Fragment>
            <h1 class="large text-primary">Agregar experiencia</h1>
            <p class="lead">
                <i class="fas fa-code-branch" /> Agrega cualquier experiencia de
                programación o desarrollo que hayas tenido en el pasado
            </p>
            <small>
                <b>*</b> = campo requerido
            </small>
            <form
                class="form"
                onSubmit={e => {
                    e.preventDefault();
                    addExperience(formData, history);
                }}
            >
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* Título del empleo"
                        name="title"
                        value={title}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* Compañía"
                        name="company"
                        value={company}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="Dirección"
                        name="location"
                        value={location}
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
                        Trabajo actual
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
                        placeholder="Descripción del empleo"
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

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
};

export default connect(
    null,
    { addExperience }
)(withRouter(AddExperience));
