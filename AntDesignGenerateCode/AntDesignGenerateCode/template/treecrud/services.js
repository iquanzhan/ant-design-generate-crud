import request from '@/utils/request';


/** ---------获取#{tableNameChinese},根据父Id-------- */
export async function get#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/select`, {
        method: 'POST',
        body: data
    });
}

/** ---------获取所有#{tableNameChinese}，分级-------- */
export async function getAll#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/list`, {
        method: 'POST',
        body: data
    });
}

/** ---------增加#{tableNameChinese}-------- */
export async function add#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/save`, {
        method: 'POST',
        body: data
    });
}

/** ---------编辑#{tableNameChinese}-------- */
export async function edit#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/save`, {
        method: 'POST',
        body: data
    });
}

/** ---------禁用#{tableNameChinese}-------- */
export async function disable#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/stopUsing?#{primaryKey}=${data}`);
}

/** ---------启用#{tableNameChinese}-------- */
export async function enable#{tableNameUpper}(data) {
    return request(`/api/data/#{tableName}/startUsing?#{primaryKey}=${data}`);
}





