import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/es';

import { messages } from '../../helpers/calendar-messages';
import { Navbar } from '../ui/Navbar';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModalAction } from '../../actions/ui';
import { AddNewFab } from '../ui/AddNewFab';
import { eventSetActiveAction, eventClearActiveEventAction, eventStartLoading } from '../../actions/events';
import { DeleteEventFab } from '../ui/DeleteEventFab';

import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es')
const localizer = momentLocalizer(moment);

// const events = [{
//     title: 'Cumpleaños del jefe',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     notes: 'comprar pastel',
//     user: {
//         _id: '123',
//         name: 'Fernando'
//     }
// }]

export const CalendarScreen = () => {

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');
    const dispatch = useDispatch()

    const { events, activeEvent } = useSelector(state => state.calendar)
    const { uid } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(eventStartLoading())
    }, [dispatch])

    const onDoubleClick = (e) => {
        dispatch(uiOpenModalAction())
    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActiveAction(e))
    }

    const onViewChange = (e) => {
        setLastView(e)
        localStorage.setItem('lastView', e)
    }

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEventAction())
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: (uid === event.user._id) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            diplay: 'block',
            color: 'white'
        }
        return {
            style
        }
    };

    return (
        <div className="calendar-screen">
            <Navbar />
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onSelectSlot={onSelectSlot}
                selectable={true}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view={lastView}
            />

            <AddNewFab />

            {
                activeEvent &&
                < DeleteEventFab />
            }

            <CalendarModal />
        </div>
    )
}
