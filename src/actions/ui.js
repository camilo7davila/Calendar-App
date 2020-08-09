import { types } from "../types/types"

export const uiOpenModalAction = () => {
    return {
        type: types.uiOpenModal
    }
}

export const uiCloseModalAction = () => {
    return {
        type: types.uiCloseModal
    }
}