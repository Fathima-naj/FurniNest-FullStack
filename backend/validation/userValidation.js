const joi=require('joi')

const registerValidation=joi.object({
    name:joi.string(),
    username:joi.string()
    .min(4)
    .max(15)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
        'string.min':'Username must be at least 4 characters.',
        'string.max': 'Username must not exceed 15 characters.',
        'string.empty': 'Username is required.',
        'string.pattern.base': 'Username can only contain numbers,letters and underscores(_).',
    }),
    email:joi.string()
    .email()
    .required()
    .messages({
        'string.email':'Please enter a valid email address.',
        'string.empty':'Email is required.'
    }),
    password:joi.string()
    .min(6)
    .required()
    .messages({
        'string.min':'Password must be at least contain 6 characters.',
        'string.empty':'Password is required.'
    }),
    isAdmin: joi.boolean().optional() 
});


const loginValidation=joi.object({
    email:joi.string()
    .required()
    .email()
    .message({
        'string.email':'Please Enter a valid email address.',
        'string.empty':'Email is required.'
    }),
    password:joi.string()
    .required()
    .messages({
        'string.empty':'Password is required.'
    }),
});

module.exports={registerValidation,loginValidation};