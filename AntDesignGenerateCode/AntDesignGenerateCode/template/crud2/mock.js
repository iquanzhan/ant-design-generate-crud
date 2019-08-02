// 代码中会兼容本地 service mock 以及部署站点的静态数据
import mockjs from 'mockjs';
const Random = mockjs.Random;

export default {
  /** ---------获取在审产品-------- */
  'POST /api/migration/queryProduct': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: {
      total: 10,
      pageNum: 1,
      pageSize: 10,
      list: [
        {
          product_oid: '1',
          product_name: '产品名称产品名称产品名称产品名称产品名称',
          product_name_en: '英文名称',
          product_pinyin: '	汉语拼音',
          enterprise_name: '	生产企业',
          enterprise_name_en: '	生产企业（英文）',
          local_unit_name: '	境内申报机构名称',
          local_unit_address: '	境内申报机构地址',
          local_unit_people: '	境内申报机构联系人',
          local_unit_phone: '	境内申报机构联系电话',
          enterprise_address: '	生产企业地址',
          enterprise_address_en: '	生产企业地址（英文）',
          product_country: '	生产国',
          product_country_two: '	第二生产国',
          product_province: '	省/ 市',
          regist_unit_name: '	申报单位',
          regist_unit_name_en: '	申报单位（英文）',
          regist_unit_address: '	申报单位地址',
          ent_oid: '	企业内码',
          task_state: '	流程状态',
          task_id: '	流程id',
          product_type: '	产品类型',
        }
      ]
    }
  }),
  /** ---------增加-------- */
  'POST /api/migration/queryProduct': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
  /** ---------删除-------- */
  'POST /api/migration/queryProduct': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  }),
  /** ---------修改-------- */
  'POST /api/migration/queryProduct': mockjs.mock({
    code: 0,
    msg: '查询成功',
    resultData: null
  })
};
