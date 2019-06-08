import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ postId, addComment }) => {
    const [text, setText] = useState("");
    return (
        <div class="post-form">
            <div class="bg-primary p">
                <h3>Deja un comentario...</h3>
            </div>
            <form
                class="form my-1"
                onSubmit={e => {
                    e.preventDefault();
                    addComment(postId, { text });
                    setText("");
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Comparte tu opinión..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                />
                <input type="submit" class="btn btn-dark my-1" value="Enviar" />
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired
};

export default connect(
    null,
    { addComment }
)(CommentForm);
