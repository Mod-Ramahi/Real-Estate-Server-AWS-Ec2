const yup = require('yup')

const registerSchema = yup.object().shape(
    {
    name: yup.string().required('enter the admin username')
        .min(3, 'admin name must be at least 3 characters')
        .max(12, 'user name must not exceed 12 characters'),
    password: yup.string().required('enter the admin password')
        .min(8, 'password must be at least 8 characters')
        .max(16, 'password must not exceed 18 characters')
    }
)

module.exports = registerSchema