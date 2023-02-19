require('dotenv').config();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const currentUrl = process.env.CURRENT_URL;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

transporter.verify((err, success) => {
    if (err) {
        console.log('Connect to nodemailer Failed!');
    } else {
        console.log('Connect to nodemailer successfully!');
    }
})

// Sent password reset email
const senResetEmail = ({ _id, email, account }, res) => {
    const resetString = uuidv4() + _id;

    // Clear all existing records
    PasswordReset.deleteMany({ userId: _id })
        .then(() => {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: '[Thông báo] - Lấy lại mật khẩu!',
                html: `<p>Bạn hoặc ai đó đã sử dụng email để gửi yêu cầu lấy lại mật khẩu cho tài khoản: <b>${account}</b> !</p>
                    <p>Vui lòng truy cập đường dẫn: <a href=${currentUrl + "resetPassword/" + _id + "/" + resetString + "/" + email + "/" + account}>
                    ${currentUrl + "resetPassword/" + _id + "/" + resetString + "/"}</a> để xác nhận yêu cầu.</p> <br/>
                    <p>Lưu ý: Đường link chỉ được sử dụng 01 lần và có <b>thời hạn trong 24 giờ.</b></p>
                    <p>Sau thời gian trên sẽ không thể truy cập để thực hiện yêu cầu lấy lại mật khẩu.</p>
                    <p>Trân trọng cảm ơn,</p> <br/> <p>------------------------------------------------------------</p>
                    <p>Thanks and best regards,</p> <p><i>Development</i></p>`
            };

            // Hash the reset String
            const saltRounds = 10;
            bcrypt.hash(resetString, saltRounds)
                .then(data => {
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: data,
                        createAt: Date.now(),
                        expiresAt: Date.now() + 86400000,
                    })

                    newPasswordReset.save()
                        .then(() => {
                            transporter.sendMail(mailOptions)
                                .then(() => {
                                    res.status(200).json({ message: 'Yêu cầu đã được gửi, vui lòng kiểm tra email!' });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Gửi mail xác nhận không thành công!' });
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(403).json({ message: 'Gửi mail xác nhận không thành công!' });
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Gửi mail xác nhận không thành công!' });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(403).json({ message: 'Gửi mail xác nhận không thành công!' });
        })
}

class PasswordResetController {

    resetPassword(req, res) {
        let { userId, resetString, password, captcha, email } = req.body;
        if (captcha == req.session.captcha) {
            PasswordReset.find({ userId })
                .then(data => {
                    if (data.length > 0) {

                        // password reset record exist so we proceed
                        const { expiresAt } = data[0];
                        const hashedResetString = data[0].resetString;

                        if (expiresAt < Date.now()) {
                            PasswordReset.deleteOne({ userId })
                                .then(() => {
                                    res.status(403).json({ message: 'Yêu cầu lấy lại mật khẩu đã hết hạn!' });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });

                                })
                        } else {
                            // Compare resetString
                            bcrypt.compare(resetString, hashedResetString)
                                .then(data => {
                                    if (data) {
                                        // Hash password again
                                        const saltRounds = 10;
                                        bcrypt.hash(password, saltRounds)
                                            .then(data => {
                                                // Update user password
                                                User.updateOne({ _id: userId }, { password: data })
                                                    .then(() => {
                                                        // Update complete 
                                                        PasswordReset.deleteOne({ userId })
                                                            .then(() => {
                                                                res.status(403).json({ message: 'Đổi mật khẩu thành công!' });
                                                            })
                                                            .catch(err => {
                                                                console.log(err);
                                                                res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                                                            })
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                                            })
                                    } else {
                                        res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                                })
                        }
                    } else {
                        res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Cập nhật mật khẩu mới không thành công!' });
                })
        } else {
            res.status(403).json({ message: 'Mã captcha không đúng!' });
        }

    }

    getReset(req, res) {
        let { userId, resetString, email, account, error } = req.params;
        if (error === 'noError') error = '';
        res.render('form/resetPassword', { userId, resetString, email, account, error });
    }

    passwordrr(req, res) {
        const { email, account, captcha } = req.body;
        if (req.session.captcha === captcha) {
            User.find({ email, account })
                .then(data => {
                    if (data.length) {
                        if (!data[0].verified) {
                            res.status(403).json({ message: 'Tài khoản chưa được xác minh!' });
                        } else {
                            senResetEmail(data[0], res);
                        }
                    } else {
                        res.status(403).json({ message: 'Tài khoản không tồn tại!' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(403).json({ message: 'Tài khoản chưa được xác minh!' });
                })
        } else {
            res.status(403).json({ message: 'Mã captcha không đúng!' });
        }
    }

    getRequest(req, res) {
        res.render('form/passwordrr');
    }

}

module.exports = new PasswordResetController;