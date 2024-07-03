import React, {useEffect, useState} from 'react';
import Post from "../components/Post";
import ReactMarkdown from 'react-markdown'
import CommentsBlock from "../components/CommentsBlock";
import Index from "../components/AddComment";
import {useParams} from "react-router-dom";
import axios from "../axios";

const FullPost = () => {
    const {id} = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(res => {
                setData(res.data)
                setLoading(false)
            }).catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
        }
    },[id])

    if (loading) {
        return <Post isLoading={loading} isFullPost/>
    }

    return (
        <>
            <Post
                _id={data._id}
                title={data.title}
                imageUrl={data?.imageUrl ? `http://localhost:4444${data?.imageUrl}` : ''}
                // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={3}
                tags={data.tags}

            >
                <ReactMarkdown children={data.text}/>
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: "Вася Пупкин",
                            avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                        },
                        text: "Это тестовый комментарий 555555",
                    },
                    {
                        user: {
                            fullName: "Иван Иванов",
                            avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                        },
                        text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    },
                ]}
                isLoading={false}
            >
                <Index/>
            </CommentsBlock>
        </>
    );
};

export default FullPost;