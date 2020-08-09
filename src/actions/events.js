import Swal from "sweetalert2";

import { types } from "../types/types";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {

        const { uid, name } = getState().auth

        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();
            // console.log(body);
            if (body.ok) {
                event.id = body.evento.id;
                event.user = {
                    _id: uid,
                    name
                }
                dispatch(eventAddNewAction(event))
            }
        } catch (error) {
            Swal.fire('Error', error.msg, 'error')
        }
    }
}

const eventAddNewAction = (event) => ({
    type: types.eventAddNew,
    payload: event
})


export const eventSetActiveAction = (event) => ({
    type: types.eventSetActive,
    payload: event
})

export const eventClearActiveEventAction = () => ({
    type: types.eventClearActiveEvent
})

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();
            if (body.ok) {
                dispatch(eventUpdatedAction(event))
            } else {
                Swal.fire('Error', body.msg, 'error')
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const eventUpdatedAction = (event) => ({
    type: types.eventUpdated,
    payload: event,
});

export const eventStartDelete = () => {
    return async (dispatch, getState) => {

        const {id} = getState().calendar.activeEvent
        try {
            const resp = await fetchConToken(`events/${id}`, {}, 'DELETE');
            const body = await resp.json();
            if (body.ok) {
                dispatch(eventDeletedAction())
            } else {
                Swal.fire('Error', body.msg, 'error')
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const eventDeletedAction = () => ({
    type: types.eventDeleted
})

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken('events');
            const body = await resp.json();
            if (body.ok) {
                const events = prepareEvents(body.eventos);
                // console.log(events);
                dispatch(eventLoading(events));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const eventLoading = (events) => ({
    type: types.eventLoaded,
    payload: events
})

export const eventLogutAction = () => ({
    type: types.eventLogout
})