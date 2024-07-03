import React from 'react';
import styles from './Login.module.scss';
import {Avatar, Button, Paper, TextField, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";

const Registration = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            fullName: 'Vasya',
            email: 'Vasya@test.kg',
            password: '1234'
        },
    })

    const onSubmit = async (value) => {
        const data = await dispatch(fetchRegister(value))

        if (!data.payload) {
            return alert('Не удалось авторизоваться')
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    if (isAuth) {
        return <Navigate to="/login"/>
    }

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{width: 100, height: 100}}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                className={styles.field}
                label="Полное имя"
                error={Boolean(errors.fullName?.message)}
                helperText={errors.fullName?.message}
                {...register('fullName', {required: 'Укажите имя'})}
                fullWidth
            />
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
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};

export default Registration;