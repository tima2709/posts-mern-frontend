import React, {useEffect, useState} from 'react';
import Post from "../components/Post";
import ReactMarkdown from 'react-markdown'
import CommentsBlock from "../components/CommentsBlock";
import Index from "../components/AddComment";
import {useParams} from "react-router-dom";
import axios from "../axios";
import {useDispatch, useSelector} from "react-redux";
import {addNewComments, getComments} from "../redux/slices/comments";

const FullPost = () => {
    const dispatch = useDispatch()
    const {id} = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(res => {
                setData(res.data)
                setLoading(false)
            }).catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
            dispatch(getComments(id))
        }
    },[id])

    const comments = useSelector(state => state.comments.comments)

    const handleAddNewComment = async () => {
        await dispatch(addNewComments({
            title: comment,
            postId: id
        }))
        setComment('')
        await dispatch(getComments(id))
    }

    if (loading) {
        return <Post isLoading={loading} isFullPost/>
    }

    return (
        <>
            <Post
                _id={data._id}
                title={data.title}
                imageUrl={data?.imageUrl ? `${data?.imageUrl}` : ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={3}
                tags={data.tags}

            >
                <ReactMarkdown children={data.text}/>
            </Post>
            <CommentsBlock
                items={comments.items}
                isLoading={false}
            >
                <Index
                    setComment={setComment}
                    comment={comment}
                    handleAddNewComment={handleAddNewComment}
                />
            </CommentsBlock>
        </>
    );
};

export default FullPost;