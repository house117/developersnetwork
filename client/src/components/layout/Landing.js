import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Landing = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }
    return (
        <div style={{marginTop : '-140px'}}>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner">
                        <h1 className="x-large shadow">Developer'sNetwork</h1>
                        <p className="lead">
                            Crea tu perfil de desarrollador, comparte tus
                            experiencias, posts, conecta con otros
                            desarrolladores!
                        </p>
                        <div className="buttons">
                            <Link to="/register" className="btn btn-primary">
                                Regístrate
                            </Link>
                            <Link to="/login" className="btn btn-light">
                                Inicia sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps)(Landing);
