import request from '@/utils/request';


/** ---------获取#{tableNameChinese}-------- */
export async function get#{tableNameUpper}(data) {
    return request(`/api/#{tableName}/search`, {
        method: 'POST',
        body: data,
        isShowLoading: true
    });
}



