const userPost = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
module.exports.GetUsers = (req, res) => {
    userPost.find({}, 'name email')
    .then(result => {
        res.status(200).json({
            message: "Data Berhasil Diget!",
            code: 200,
            data: result
        });
    });
}
 
module.exports.Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;

    if(password !== confPassword) return res.status(400).json({mesasge: "Password dan Confirm Password tidak cocok"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    let Posting = new userPost({
        name: name,
        email: email,
        password: hashPassword,
        foto: 'none',
        refresh_token: null
    })

    Posting.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Register Berhasil",
                data: {name, email}
            });
        })
}
 
module.exports.Login = async(req, res) => {
        userPost.find({
            email: req.body.email
        })
            .then(result => {
                bcrypt.compare(req.body.password, result[0].password)
                    .then(match => {
                        if(!match) return res.status(400).json({message: "Wrong Password"});
                    })
                    .catch(err => console.error(err))

                const userId = result[0].id;
                const name = result[0].name;
                const email = result[0].email;
                const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
                    expiresIn: '20s'
                }); 
                const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
                    expiresIn: '1d'
                });

                userPost.updateOne({ _id: userId }, { $set: { refresh_token: refreshToken } })
                    .then(result => {
                        res.cookie('refreshToken', refreshToken,{
                            httpOnly: true,
                            maxAge: 24 * 60 * 60 * 1000
                        });
                        res.json({ accessToken })
                    })
                    .catch(error => console.error(error))
            })
}
 
module.exports.Logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    userPost.find({
        refresh_token: refreshToken
    })
        .then(result => {
            if(!result) return res.sendStatus(204);
            const userId = result.id;
            userPost.updateOne({ _id: userId }, { $set: { refresh_token: refreshToken } })
                .then(result => {
                    res.clearCookie('refreshToken');
                    res.status(200).json({
                        message: "Berhasil Logout!"
                    })
                })
        })
}