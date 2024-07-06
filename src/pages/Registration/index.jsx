import React, {useState, useRef} from 'react';
import styles from './Login.module.scss';
import {Avatar, Button, Paper, TextField, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import axios from "axios";

const Registration = () => {
    const [imageUrl, setImageUrl] = useState('')
    const dispatch = useDispatch()
    const inputRef = useRef()
    const isAuth = useSelector(selectIsAuth)

    const {register, handleSubmit, setValue, formState: {errors}} = useForm({
        defaultValues: {
            fullName: 'Vasya',
            email: 'Vasya@test.kg',
            password: '12345'
        },
    })

    const handleChangeFile = async (event) => {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('file', file);
        formData.append('upload_preset', 'ifykirnt');
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dpqnzuhp5/image/upload', formData);
            const imageUrl = response.data.url; // Получаем URL изображения
            setImageUrl(imageUrl);
            setValue('avatarUrl', imageUrl)
        } catch (err) {
            console.log(err);
            alert('Ошибка при загрузке файла');
        }
    };

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

    console.log(imageUrl, 'url')

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{width: 100, height: 100}} src={imageUrl}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Button onClick={() => inputRef.current.click()} variant="contained">Загрузить фото</Button>
                <input
                    onChange={handleChangeFile}
                    ref={inputRef}
                    type="file"
                    hidden
                />
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