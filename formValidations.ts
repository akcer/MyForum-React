import * as yup from 'yup';

export let registerUserValidationSchema = yup.object().shape({
  username: yup.string().trim().required('Username is required'),
  password: yup.string().trim().required('Password is required').min(6),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf(
      [yup.ref('password'), null],
      'Passwords and Confirm Password must match'
    ),
  email: yup.string().trim().email().required('Email is required'),
  avatar: yup.string().trim().url(),
});

export let loginUserValidationSchema = yup.object().shape({
  username: yup.string().trim().required('Username is required'),
  password: yup.string().trim().required('Password is required'),
});

export let newThreadValidationSchema = yup.object().shape({
  title: yup.string().trim().required('Thread title is required'),
  description: yup.string().trim().required('Thread description is required'),
});

export let newCategoryValidationSchema = yup.object().shape({
  section: yup.number().required('Select Section'),
  categoryTitle: yup.string().trim().required('Category title is required'),
  categoryDescription: yup
    .string()
    .trim()
    .required('Category description is required'),
});

export let newSectionValidationSchema = yup.object().shape({
  section: yup.string().trim().required('Section title is required'),
});
