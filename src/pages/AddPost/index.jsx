import React, {useEffect, useRef} from 'react';
import styles from './AddPost.module.scss'
import {Button, Paper, TextField} from "@mui/material";
import SimpleMDE from 'react-simplemde-editor'
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import axios from 'axios';
import instance from '../../axios'
import 'easymde/dist/easymde.min.css'


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
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('file', file);
        formData.append('upload_preset', 'ifykirnt');
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dpqnzuhp5/image/upload', formData);
            const imageUrl = response.data.url; // Получаем URL изображения
            setImageUrl(imageUrl); // Устанавливаем URL изображения в состояние
        } catch (err) {
            console.log(err);
            alert('Ошибка при загрузке файла');
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
                ? await instance.patch(`/posts/${id}`, fields)
                : await instance.post('/posts', fields)

            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`)

        } catch (err) {
            console.warn(err)
            alert('Ошибка при создании статьи')
        }
    }

    useEffect(() => {
        if (id) {
            instance.get(`/posts/${id}`).then(({data}) => {
                setText(data.text);
                setTitle(data.title);
                setTags(data.tags.join(','));
                setImageUrl(data.imageUrl)
            }).catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
        }
    }, [])

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
                        src={imageUrl}
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