const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const User = require("../../models/User");

//@route    GET api/auth
//@desc     Ruta de testeo
//@access   Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(user);
        res.status(500).send("Error de servidor");
    }
});

//@route    POST api/auth
//@desc     Autenticar al usuario y obtener token
//@access   Public
router.post(
    "/",
    [
        check("email", "Por favor incluye un email válido").isEmail(),
        check("password", "Se requiere la contraseña").exists()
    ],
    async (req, res) => {
        //Verificar si el usuario existe
        //Obtener gravatar
        //Encriptación de pw
        //Return de jsonwebtoken
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: "Datos inválidos" }]
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: "Datos inválidos" }]
                });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Error de servidor");
        }
    }
);

module.exports = router;
