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
        }
    },

    reducers: {
        get#{tableNameUpper}Status(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        }   
    },
};