import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";


export const getComments = createAsyncThunk('comments/getComments', async (postId) => {
    const { data } = await axios.get(`/comments?postId=${postId}`); // postId => URL-параметр
    return data;
});

export const getLastComments = createAsyncThunk('comments/getLastComments', async () => {
    const { data } = await axios.get(`/lastComments`);
    return data;
});

export const addNewComments = createAsyncThunk('comments/addNewComments', async ({title, postId}) => {
    const {data} = await axios.post('/comments', {
        title,
        postId
    })

    return data
})

const initialState = {
    comments: {
        items: [],
        comment: {},
        status: 'loading'
    },
    lastComments: {
        items: [],
        status: 'loading'
    }
}

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = 'loading'
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = 'loaded'
            })
            .addCase(getComments.rejected, (state, action) => {
                state.comments.items = [];
                state.comments.status = 'error'
            })
            .addCase(addNewComments.pending, (state) => {
                state.comments.comment = {};
                state.comments.status = 'loading'
            })
            .addCase(addNewComments.fulfilled, (state, action) => {
                state.comments.items = [...state.comments.items, action.payload];
                state.comments.status = 'loaded'
            })
            .addCase(addNewComments.rejected, (state, action) => {
                state.comments.comment = {};
                state.comments.status = 'error'
            })
            .addCase(getLastComments.pending, (state) => {
                state.lastComments.items = [];
                state.comments.status = 'loading'
            })
            .addCase(getLastComments.fulfilled, (state, action) => {
                state.lastComments.items = action.payload;
                state.comments.status = 'loaded'
            })
            .addCase(getLastComments.rejected, (state, action) => {
                state.lastComments.items = [];
                state.comments.status = 'error'
            })
    }
})

export const commentsReducer = commentSlice.reducer