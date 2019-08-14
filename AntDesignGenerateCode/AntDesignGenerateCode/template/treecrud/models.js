import {get#{tableNameUpper},add#{tableNameUpper},edit#{tableNameUpper},delete#{tableNameUpper},disable#{tableNameUpper},enable#{tableNameUpper},getAll#{tableNameUpper} } from '@/services/#{tableName}';

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
        *getAll#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(getAll#{tableNameUpper}, payload);
            
            yield put({
                type: 'getAll#{tableNameUpper}Status',
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
        //禁用
        *disable#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(disable#{tableNameUpper}, payload);

            yield put({
                type: 'disable#{tableNameUpper}Status',
                payload: response,
            });
        },
        //启用
        *enable#{tableNameUpper}({ payload }, { call, put }) {
            let response = yield call(enable#{tableNameUpper}, payload);

            yield put({
                type: 'enable#{tableNameUpper}Status',
                payload: response,
            });
        },
        
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
        enable#{tableNameUpper}Status(state, action) {
            return {
                ...state,
                enable#{tableNameUpper}Status: action.payload,
            };
        },
        disable#{tableNameUpper}Status(state, action) {
            return {
                ...state,
                disable#{tableNameUpper}Status: action.payload,
            };
        },
        getAll#{tableNameUpper}Status(state, action) {
            return {
                ...state,
                getAll#{tableNameUpper}Status: action.payload,
            };
        },
        
    },
};