import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export type UserState = {
    id?: string
    firstName: string
    lastName: string
    phone: string
}


const initialState: UserState = {
    id: 'me',
    firstName: 'حسین',
    lastName: 'نجفی',
    phone: '09123456789'
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<Partial<UserState>>) {
            return { ...state, ...action.payload }
        },
        updateProfile(state, action: PayloadAction<Partial<UserState>>) {
            if (action.payload.firstName !== undefined) state.firstName = action.payload.firstName
            if (action.payload.lastName !== undefined) state.lastName = action.payload.lastName
        },
        setPhone(state, action: PayloadAction<string>) {
            state.phone = action.payload
        }
    }
})


export const { setUser, updateProfile, setPhone } = userSlice.actions
export default userSlice.reducer