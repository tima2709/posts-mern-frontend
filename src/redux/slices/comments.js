import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";


export const getComments = createAsyncThunk('comments/getComments', async (postId) => {
    const { data } = await axios.get(`/comments?postId=${postId}`); // Передаем postId как URL-параметр
    return data;
});

export const addNewComments = createAsyncThunk('comments/addNewComments', async ({title, postId}) => {
    console.log(title, postId)
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
    }
})

export const commentsReducer = commentSlice.reducer