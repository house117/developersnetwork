const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

const Posts = require("../../models/Posts");
const Profile = require("../../models/Profile");

const User = require("../../models/User");

//@route    POST api/posts
//@desc     Crear un post
//@access   Private
router.post(
    "/",
    [
        auth,
        [
            check("text", "Se necesita un texto")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");

            const newPost = new Posts({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

//@route    GET api/posts
//@desc     Obtener todos los posts
//@access   Private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Posts.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});
module.exports = router;

//@route    GET api/posts/:id
//@desc     Obtener post por id
//@access   Private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post no encontrado" });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post no encontrado" });
        }
        res.status(500).send("Error de servidor");
    }
});
//@route    DELETE api/posts/:id
//@desc     Eliminar un post
//@access   Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post no encontrado" });
        }

        //Verificar usuario
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }

        await post.remove();

        res.json({ msg: "Post eliminado" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post no encontrado" });
        }
        res.status(500).send("Error de servidor");
    }
});

//@route    PUT api/posts/like/:id
//@desc     Dar like a un post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        //Verificar que no haya sido likeado
        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "El post ya tiene like" });
        }
        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route    PUT api/posts/unlike/:id
//@desc     unlike a un post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        //Verificar que no haya sido likeado
        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "El post no ha sido likeado" });
        }
        // Obtener el index para remover
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route    POST api/posts/comment/:id
//@desc     Comentar un post
//@access   Private
router.post(
    "/comment/:id",
    [
        auth,
        [
            check("text", "Se necesita un texto")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Posts.findById(req.params.id);
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

//@route    delete api/posts/comment/:id/:comment_id
//@desc     Eliminar comentario
//@access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        //Obtener comentario del post
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );
        //Verificar que existe el comentario
        if (!comment) {
            return res.status(404).json({ msg: "El comentario no existe" });
        }
        //Verificar que el usuario sea el dueño del comentario
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }
        // Obtener el index para remover
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});
module.exports = router;
