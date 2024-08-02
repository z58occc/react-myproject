import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
    name: "message",
    initialState: [
    ],
    reducers: {
        createMessage(state, action) {
            if (action.payload.success) {
                state.push({
                    id: action.payload.id,
                    type: 'success',
                    title: "成功",
                    text: action.payload.message,
                });
            } else {
                state.push({
                    id: action.payload.id,
                    type: 'danger',
                    title: "錯誤",
                    text: Array.isArray(action.payload?.message) ? action.payload?.message.join('、') : action.payload?.message,
                });
            }


            // setTimeout(()=>{
            //     // state沒有辦法在非同步的狀態下存取
            //     const index = state.findIndex(item=>item===id);

            //     state.splice(index,1);
            // },2000);
        },
        removeMessage(state, action) {
            console.log('removeMessage', action.payload);
            const index = state.findIndex(item => item === action.payload);
            state.splice(index, 1);
        }
    }
})
// 這裡建立的方法 可以被其他元件使用
// 自定義名稱 async function
export const createAsyncMessage = createAsyncThunk(
    'message/createAsyncMessage',
    async function (payload, { dispatch, requestId }) {
        // console.log('createAsyncMessage',payload,{dispatch,params});
        dispatch(messageSlice.actions.createMessage({
            ...payload,
            id: requestId,
        }));
        setTimeout(() => {
            dispatch(messageSlice.actions.removeMessage(requestId))
        }, 3000)
    }
);

export const { createMessage } = messageSlice.actions


export default messageSlice.reducer;