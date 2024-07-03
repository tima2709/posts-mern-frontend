import React, {useEffect, useRef} from 'react';
import styles from './AddPost.module.scss'
import {Button, Paper, TextField} from "@mui/material";
import SimpleMDE from 'react-simplemde-editor'
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";

import 'easymde/dist/easymde.min.css'
import axios from "../../axios";

const AddPost = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setIsLoading] = React.useState(false);
    const [text, setText] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const inputFileRef = useRef()

    const isEditing = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData)
            setImageUrl(data.url)
        } catch (err) {
            console.warn(err)
            alert('Ошибка при загрузке файла')
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('')
    };

    // useCallback для simpleMDE необходима, акркдаваемя функция должна быть передана с useCallback
    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading(true)

            const fields = {
                title,
                text,
                tags,
                imageUrl
            }

            const {data} = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields)

            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`)

        } catch (err) {
            console.warn(err)
            alert('Ошибка при создании статьи')
        }
    }

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({data}) => {
                setText(data.text);
                setTitle(data.title);
                setTags(data.tags.join(','));
                setImageUrl(data.imageUrl)
            }).catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
        }
    },[])

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/"/>
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
                variant="standard"
                placeholder="Тэги"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? "Сохранить" : "Опубликовать"}
                </Button>
                <Link to="/">
                    <Button size="large">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};

export default AddPost;