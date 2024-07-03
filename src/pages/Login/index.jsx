import React from 'react';
import styles from "./Login.module.scss";
import {useDispatch, useSelector} from "react-redux";
import { Navigate } from "react-router-dom";
import {Button, Paper, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";

import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";

const Login = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            email: 'qwerty111@test.kg',
            password: '12345'
        },
        // можно установить mode при фокусе или отправке onChange
        // mode: 'all'
    })

    const onSubmit = async (value) => {
     const data = await dispatch(fetchAuth(value))

        if (!data.payload) {
            return alert('Не удалось авторизоваться')
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    if (isAuth) {
        return <Navigate to="/"/>
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Укажите почту'})}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Укажите пароль'})}
                    fullWidth
                />
                <Button type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};

export default Login;