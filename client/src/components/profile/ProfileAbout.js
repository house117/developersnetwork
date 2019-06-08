import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name }
    }
}) => (
    <div class="profile-about bg-light p-2">
        {bio && (
            <Fragment>
                <h2 class="text-primary">
                    {" "}
                    Biografía de {name.trim().split(" ")[0]}
                </h2>
                <p>{bio}</p>
                <div class="line" />
            </Fragment>
        )}

        <h2 class="text-primary">Habilidades (skills)</h2>
        <div class="skills">
            {skills.map((skill, index) => (
                <div key={index} className="p-1">
                    <i className="fas fa-check" /> {skill}
                </div>
            ))}
        </div>
    </div>
);
ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileAbout;
