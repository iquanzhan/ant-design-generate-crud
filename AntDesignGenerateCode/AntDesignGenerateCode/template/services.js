import request from '@/utils/request';


/** ---------获取#{tableNameChinese}-------- */
export async function get#{tableNameUpper}(data) {
    return request(`/api/#{tableName}/search`, {
        method: 'POST',
        body: data,
        isShowLoading: true
    });
}

/** ---------增加#{tableNameChinese}-------- */
export async function add#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'POST',
        body: data,
        isShowLoading: true
    });
}

/** ---------编辑#{tableNameChinese}-------- */
export async function edit#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'PUT',
        body: data,
        isShowLoading: true
    });
}

/** ---------删除#{tableNameChinese}-------- */
export async function delete#{tableNameUpper}(data) {
    return request(`/api/#{tableName}`, {
        method: 'DELETE',
        body: data,
        isShowLoading: true
    });
}



