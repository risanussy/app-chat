const userPost = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
module.exports.Register = (req, res) => {
    const { name, email, password, confPassword } = req.body;

    if(password !== confPassword) return res.status(400).json({mesasge: "Password dan Confirm Password tidak cocok"});

    bcrypt.genSalt().then(salt => {
        bcrypt.hash(password, salt).then(hashPassword => {
            let Posting = new userPost({
                name: name,
                email: email,
                password: hashPassword,
                foto: 'none',
                refresh_token: null
            })
        
            Posting.save()
                .then(() => {
                    res.status(200).json({
                        message: "Register Berhasil",
                        data: {name, email}
                    });
                })

        })
    });

}
 
module.exports.Login = (req, res) => {
        userPost.find({
            email: req.body.email
        })
            .then(result => {
                if(!result[0]) return res.status(404).json({message: "Email not found"});

                bcrypt.compare(req.body.password, result[0].password)
                    .then(match => {
                        if(!match) return res.status(400).json({message: "Wrong Password"});

                        const id = result[0]._id;
                        const name = result[0].name;
                        const email = result[0].email;

                        const accessToken = jwt.sign({id, name, email}, process.env.ACCESS_TOKEN_SECRET,{
                            expiresIn: '20s'
                        }); 

                        const refreshToken = jwt.sign({id, name, email}, process.env.REFRESH_TOKEN_SECRET,{
                            expiresIn: '1d'
                        });

                        userPost.updateOne({ _id: id }, { $set: { refresh_token: refreshToken } })
                            .then(() => {
                                // untuk set cookie
                                res.cookie('refreshToken', refreshToken,{
                                    httpOnly: true,
                                    maxAge: 24 * 60 * 60 * 1000
                                });
                                // respon access token
                                res.json({ accessToken })
                            })
                            .catch(error => console.error(error))
                    })
                    .catch(err => console.error(err))
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
            const id = result._id;

            // fungsi $set untuk mengupdate tanpa menghapus data data lainnya
            userPost.updateOne({ _id: id }, { $set: { refresh_token: refreshToken } }) 
                .then(() => {
                    // hapus cookie
                    res.clearCookie('refreshToken');
                    res.status(200).json({
                        message: "Berhasil Logout!"
                    })
                })
        })
}