import {get#{tableNameUpper},add#{tableNameUpper},edit#{tableNameUpper},delete#{tableNameUpper} } from '@/services/#{tableName}';

export default {
    namespace: '#{tableName}',

    state: {
    },

    effects: {
        *get#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(get#{tableNameUpper}, payload);
            
            yield put({
                type: 'get#{tableNameUpper}Status',
                payload: response,
            });
        },
        *add#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(add#{tableNameUpper}, payload);

            yield put({
                type: 'addStatus',
                payload: response,
            });
        },
        *edit#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(edit#{tableNameUpper}, payload);

            yield put({
                type: 'editStatus',
                payload: response,
            });
        },
        *delete#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(delete#{tableNameUpper}, payload);

            yield put({
                type: 'deleteStatus',
                payload: response,
            });
        }
    },

    reducers: {
        get#{tableNameUpper}Status(state, action) {
            return {
                ...state,
                get#{tableNameUpper}Status: action.payload,
            };
        },
        addStatus(state, action) {
            return {
                ...state,
                addStatus: action.payload,
            };
        },
        editStatus(state, action) {
            return {
                ...state,
                editStatus: action.payload,
            };
        },
        deleteStatus(state, action) {
            return {
                ...state,
                deleteStatus: action.payload,
            };
        }        
    },
};