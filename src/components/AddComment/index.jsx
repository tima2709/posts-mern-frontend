import React from 'react';
import styles from "./AddComment.module.scss";
import {Avatar, Button, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";

const Index = ({comment, setComment, handleAddNewComment}) => {
    const user = useSelector(state => state.auth.data)

    return (
        <>
            <div className={styles.root}>
                <Avatar
                    classes={{ root: styles.avatar }}
                    src={user.avatarUrl}
                />
                <div className={styles.form}>
                    <TextField
                        label="Написать комментарий"
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleAddNewComment} variant="contained">Отправить</Button>
                </div>
            </div>
        </>
    );
};

export default Index;