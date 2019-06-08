const express = require("express");
const request = require("request");
const config = require("config");

const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Posts");

//@route    GET api/profile/me
//@desc     Obtener el perfil del usuario
//@access   Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name,", "avatar"]
        );
        if (!profile) {
            return res
                .status(400)
                .json({ msg: "No hay perfil de este usuario" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});

//@route    POST api/profile/
//@desc     Crear o actualizar perfil de usuario
//@access   Private
router.post(
    "/",
    [
        auth,
        [
            check("status", "Se requiere el estatus profesional")
                .not()
                .isEmpty(),
            check("skills", "Se requieren skills")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Obtener objeto perfil
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (location) profileFields.location = location;
        if (website) profileFields.website = website;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(",")
                .map(skills => skills.trim());
        }
        //Construir perfil social
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }
            //Si no, creamos uno
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

//@route    GET api/profile/
//@desc     Obtener todos los perfiles
//@access   Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", [
            "name",
            "avatar"
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});

//@route    GET api/profile/user/:user_id
//@desc     Obtener perfil por id
//@access   Public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);
        if (!profile)
            return res.status(400).json({ msg: "Perfil no encontrado" });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({ msg: "Perfil no encontrado" });
        }
        res.status(500).send("Error de servidor");
    }
});

//@route    DELETE api/profile/
//@desc     Elimina perfil, usuario y posts
//@access   Private
router.delete("/", auth, async (req, res) => {
    try {
        //Eliminar posts del usuario
        await Post.deleteMany({ user: req.user.id });
        //Eliminar el perfil
        await Profile.findOneAndRemove({ user: req.user.id });
        //Elimina usuario
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "Usuario eliminado" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});

//@route    PUT api/profile/experience
//@desc     Agregar experiencia
//@access   Private
router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Se necesita un título")
                .not()
                .isEmpty(),
            check("company", "Se necesita una compañía")
                .not()
                .isEmpty(),
            check("from", "Se necesita una fecha de inicio")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Eliminar experiencia
//@access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        console.log("WORKS");

        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        console.log("doesnt work !!!");
        profile.experience.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});

//@route    PUT api/profile/education
//@desc     Agregar educación
//@access   Private
router.put(
    "/education",
    [
        auth,
        [
            check("school", "Se necesita una escuela")
                .not()
                .isEmpty(),
            check("degree", "Se necesita un grado de estudio")
                .not()
                .isEmpty(),
            check("fieldofstudy", "Se necesita un campo de estudio")
                .not()
                .isEmpty(),
            check("from", "Se necesita una fecha de inicio")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     Eliminar educación
//@access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        console.log("WORKS");

        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        console.log("doesnt work !!!");
        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});

//@route    GET api/profile/github/:username
//@desc     Obtener repositorios de github
//@access   Public

router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                "githubClientId"
            )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node.js" }
        };
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: "No se encontró perfil de GitHub"
                });
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error de servidor");
    }
});
module.exports = router;
