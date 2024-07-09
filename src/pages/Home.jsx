import React, {useEffect} from 'react';
import {Grid, Tab, Tabs} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import TagsBlock from "../components/TagsBlock";
import CommentsBlock from "../components/CommentsBlock";
import Post from "../components/Post";
import {getLastComments} from "../redux/slices/comments";


const Home = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.data)
    const {posts, tags} = useSelector(state => state.posts)
    const lastComments = useSelector(state => state.comments.lastComments)

    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
        dispatch(getLastComments())
    }, [dispatch])

    return (
        <>
            <Tabs style={{marginBottom: 15}} value={0} aria-label="basic tabs example">
                <Tab label="Новые"/>
                <Tab label="Популярные"/>
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, idx) =>
                        isPostsLoading ? (
                            <Post key={idx} isLoading={isPostsLoading}/>

                        ) : (
                            <Post
                                _id={obj._id}
                                title={obj.title}
                                imageUrl={obj?.imageUrl ? `${obj?.imageUrl}` : ''}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj?.comments?.length}
                                tags={obj.tags}
                                isEditable={userData?._id === obj?.user._id}
                            />
                        ))}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading}/>
                    <CommentsBlock
                        items={lastComments?.items}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Home;