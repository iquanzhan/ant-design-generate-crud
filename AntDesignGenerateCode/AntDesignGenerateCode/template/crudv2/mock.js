import mockjs from 'mockjs';
const Random = mockjs.Random;

export default {
  /** ---------获取#{tableNameChinese}-------- */
  'POST /api/#{tableName}/search': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: {
      total: 10,
      pageNum: 1,
      pageSize: 10,
      list: [
		#{mockJSON}
      ]
    }
  }),
  /** ---------增加-------- */
  'POST /api/#{tableName}': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
  /** ---------删除-------- */
  'DELETE /api/#{tableName}': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
  /** ---------修改-------- */
  'POST /api/#{tableName}': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
    /** ---------禁用-------- */
  'GET /api/data/#{tableName}/stopUsing': mockjs.mock({
    code: 0,
    msg: '禁用成功',
    resultData: null
  }),
    /** ---------启用-------- */
  'GET /api/data/#{tableName}/startUsing': mockjs.mock({
    code: 0,
    msg: '启用成功',
    resultData: null
  }),
};
