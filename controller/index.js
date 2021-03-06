const { UserModel, ProjectModel, EventModel } = require('./model');
const Joi = require('@hapi/joi');
const x = require('../crypt');
//test commit
const User = {
    model: UserModel,
    _ls: async function (filter = {}) {
        const results = await UserModel.find(filter);
        return results.map(user => user.username);
    },
    getwithrole: async function (role) {
        const results = await UserModel.find({ role });

        return results.map(user => {
            return {
                email: user.email,
                username: user.username,
                profile_img: user.profile_img,
                github: user.github,
                instagram: user.instagram,
                role: user.role,
            }
        });
    },
    adduser: async function ({ email, username, password, github, instagram, profile_img }) {

        if (!profile_img) {
            if (github) {
                profile_img = (await api.get(`https://api.github.com/users/${request.payload.github}`)).data.avatar_url;

            }
            else if (instagram) {
                profile_img = (await api.get(`https://www.instagram.com/${request.payload.instagram}/?__a=1`)).data.graphql.user.profile_pic_url;
            }
        }

        if (email && username && password) {
            const user = {
                email, username,
                password: x.encrypt(password),
                github, instagram,
                profile_img
            }
            const newuser = new UserModel(user);
            return await newuser.save();
        }
        return { details: [{ message: 'some field missing' }] }
    },
    registeruser: async function ({ email, username, password, github, instagram }) {

        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
        });

        let value;
        try {
            value = await schema.validateAsync({ email, username, password });
        } catch (error) {
            return error.details;
        }

        if (!github && !instagram)
            return { details: [{ message: 'you must add either github or instagram username' }] }

        return value;

    }

}

module.exports = User;