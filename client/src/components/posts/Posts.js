import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import { getPubli } from "../../actions/post"
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({ getPosts, post: { posts, loading }, getPubli, publi}) => {
    useEffect(() => {
        getPosts();
        getPubli();
        console.log("HOLA desde posts");

        console.log(publi);

    }, [getPosts, getPubli]);
    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>

            


            <p className="lead">
                <i className="fas fa-user" /> ¡Bienvenido a la comunidad!
            </p>
            <PostForm />
            
            <div className="posts">
                {posts.map(post => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    getPubli: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    publi: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    post: state.post,
    publi: state.publi
});
export default connect(
    mapStateToProps,
    { getPosts, getPubli }
)(Posts);
