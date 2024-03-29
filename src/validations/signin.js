import * as Yup from 'yup';
export const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email required'),
  password: Yup.string()
    .required('Password required')
    // .matches(/\b([A-Z])/g, 'Password requires first letter Capital')
    // .max(20, 'Password is too long - should be maximum 20 chars.')
    // .min(8, 'Password is too short - should be 8 chars minimum.')
    // .matches(/[0-9]/, 'Password requires a number')
    // .matches(/[a-z]/, 'Password requires a lowercase letter')
    // .matches(/[A-Z]/, 'Password requires an uppercase letter')
    // .matches(/[^\w]/, 'Password requires a special chars')
});
export const AddCategorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .required('Category Name required'),
});