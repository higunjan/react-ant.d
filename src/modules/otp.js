export const OTP_REQUESTED = 'otp/OTP_REQUESTED'

const initialState = {
    otp: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case OTP_REQUESTED:
            return {
                ...state,
                otp: ''
            }
        default:
            return state
    }
}

export const requestOtp = () => {
    return dispatch => {
        dispatch({
            type: OTP_REQUESTED
        })
    }
}

