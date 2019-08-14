import request from '@/utils/request';


/** ---------获取#{tableNameChinese}-------- */
export async function get#{tableNameUpper}(data) {
    return request(`/api/#{tableName}/search`, {
        method: 'POST',
        body: data
    });
}

/** ---------增加#{tableNameChinese}-------- */
export async function add#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'POST',
        body: data
    });
}

/** ---------编辑#{tableNameChinese}-------- */
export async function edit#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'PUT',
        body: data
    });
}

/** ---------删除#{tableNameChinese}-------- */
export async function delete#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'DELETE',
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



