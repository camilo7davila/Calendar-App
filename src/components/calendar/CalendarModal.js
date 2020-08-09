import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux';

import { eventClearActiveEventAction, eventStartAddNew, eventStartUpdate } from '../../actions/events';
import { uiCloseModalAction } from '../../actions/ui';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate(),
}

export const CalendarModal = () => {

    const [dateStart, setDateStart] = useState(now.toDate())
    const [endDate, setEndDate] = useState(nowPlus1.toDate())
    const [titleValid, setTitleValid] = useState(true);
    const [formvalues, setFormvalues] = useState(initEvent);

    const dispatch = useDispatch()

    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);

    const { notes, title, start, end } = formvalues;

    useEffect(() => {
        if (activeEvent) {
            setFormvalues(activeEvent)
        } else {
            setFormvalues(initEvent)
        }
    }, [setFormvalues, activeEvent])

    const handleInputChange = ({ target }) => {
        setFormvalues({
            ...formvalues,
            [target.name]: target.value
        });
    }

    const closeModal = () => {
        //TODO Cerrar el modal
        dispatch(uiCloseModalAction())
        dispatch(eventClearActiveEventAction())
        setFormvalues(initEvent)

    }

    const handleStartDateChange = (e) => {
        setDateStart(e)
        setFormvalues({
            ...formvalues,
            start: e
        })
    }

    const handleEndDateChange = (e) => {
        setEndDate(e)
        setFormvalues({
            ...formvalues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            Swal.fire('Error', 'fecha fin debe de ser mayor a fecha de inicio', 'error')
            return;
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        if (activeEvent) {
            console.log(formvalues);
            dispatch(eventStartUpdate(formvalues))
        } else {
            dispatch(eventStartAddNew(formvalues))
        }
        //TODO realizar grabación

        setTitleValid(true);
        closeModal()
    }

    return (
        <Modal
            isOpen={modalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> {(activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
            <hr />
            <form
                className="container"
                onSubmit={handleSubmitForm}
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className="form-control"

                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={endDate}
                        minDate={dateStart}
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
