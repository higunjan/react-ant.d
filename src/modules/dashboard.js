export const DASHBOARD_DETAILS_REQUESTED = 'otp/OTP_REQUESTED'

const initialState = {
    meeting_name: '',
    meeting_subject: '',
    meeting_date: '',
    meeting_time: '',
    meeting_id: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_DETAILS_REQUESTED:
            return {
                ...state,
                name: ''
            }
        default:
            return state
    }
}

export const requestDashboardDetails = () => {
    return dispatch => {
        dispatch({
            type: DASHBOARD_DETAILS_REQUESTED
        })
    }
}

