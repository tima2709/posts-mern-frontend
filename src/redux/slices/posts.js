import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
// createAsyncThunk для асинхронного запроса
import axios from '../../axios';
// posts/fetchPosts название action

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const {data} = await axios.get('/posts');
    return data;
})

export const fetchRemovePosts = createAsyncThunk('posts/fetchRemovePosts', async (id) => {
    await axios.delete(`/posts/${id}`);
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const {data} = await axios.get('/posts/tags')
    return data
})

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // получение статьи
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = 'error'
            })
            // получение тэгов
            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading'
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = 'error'
            })
            // удаление сатьи
            .addCase(fetchRemovePosts.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(obj => obj._id !== action?.meta.arg)
            })
    }
})

export const postsReducer = postsSlice.reducer