import mockjs from 'mockjs';
const Random = mockjs.Random;

export default {
  /** ---------获取#{tableNameChinese}-------- */
  'POST /api/data/#{tableName}/list': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: [
      #{mockJSON}
    ]
  }),
  /** ---------增加-------- */
  'POST /api/data/#{tableName}/save': mockjs.mock({
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
  /** ---------修改-------- */
  'POST /api/data/#{tableName}/save': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
  /** ---------根据父id查询字典列表-------- */
  'POST /api/data/#{tableName}/select': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: {
	"list":[
		#{mockJSON}
	], 
	"pageNum":1,
	"pageSize":10,
	"pages":575,
	"size":10,
	"startRow":1,
	"endRow":1,
	"total":5743
    }
  }),

};
