using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AntDesignGenerateCode
{
    public class TableDescript
    {
        //表名称
        public String tableName { get; set; }
        //表名称首字母大写
        public String tableNameUpper { get; set; }
        //表中文名称
        public String tableNameChinese { get; set; }

        public String tablePrimaryKey { get; set; }
        public String tablePrimaryKeyUpper { get; set; }


        public List<TableField> tableFields { get; set; }




    }
}
