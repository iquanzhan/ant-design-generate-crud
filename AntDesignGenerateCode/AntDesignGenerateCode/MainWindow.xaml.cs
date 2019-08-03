using AntDesignGenerateCode.utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace AntDesignGenerateCode
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        //CREATE TABLE `bank_info` (
        //  `bank_oid` varchar(42) NOT NULL COMMENT '附件id',
        //  `owner_oid` varchar(42) DEFAULT NULL COMMENT '业主id',
        //  `owner_name` varchar(200) DEFAULT NULL COMMENT '业主姓名',
        //  `bank_user` varchar(200) DEFAULT NULL COMMENT '收款户名',
        //  `bank_card` varchar(19) DEFAULT NULL COMMENT '银行卡号',
        //  `bank_name` varchar(200) DEFAULT NULL COMMENT '所属银行名称',
        //  `bank_pay_name` varchar(200) DEFAULT NULL COMMENT '收款银行名称',
        //  `update_employee` varchar(42) DEFAULT NULL COMMENT '更新人id',
        //  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
        //  `customer_code` varchar(200) DEFAULT NULL COMMENT '公共客商编号',
        //  `is_delete` int (11) DEFAULT NULL COMMENT '是否停用',
        //  PRIMARY KEY(`bank_oid`)
        //) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT = '银行信息表';


        private void Button_Click(object sender, RoutedEventArgs e)
        {
            string folder = labelFolder.Content.ToString();

            if (String.IsNullOrEmpty(folder))
            {
                System.Windows.MessageBox.Show("请先选择路径");
                return;
            }
            int index = comTemplate.SelectedIndex;

            bool? isPascal = checkPascal.IsChecked;
            string content = txtContent.Text;

            TableDescript tableDescript = getTablesDescript(content, isPascal);


            if (index < 0)
            {
                System.Windows.MessageBox.Show("请选择生成模版");
                return;
            }
            if (index == 0)
            {
                generateCrud(folder, tableDescript.tableName, tableDescript.tableNameUpper, tableDescript.tableNameChinese, tableDescript.tableFields, tableDescript.tablePrimaryKey);
            }
            else if (index == 1)
            {
                generateEmpty(folder, tableDescript.tableName, tableDescript.tableNameUpper, tableDescript.tableNameChinese, tableDescript.tableFields, tableDescript.tablePrimaryKey);
            }
            else if (index == 2)
            {
                generateNoPascalCrudV2(folder, tableDescript.tableName, tableDescript.tableNameUpper, tableDescript.tableNameChinese, tableDescript.tableFields, tableDescript.tablePrimaryKey);
            }
            else if (index == 3)
            {

                generateNoPascalCrudV2(folder, tableDescript.tableName, tableDescript.tableNameUpper, tableDescript.tableNameChinese, tableDescript.tableFields, tableDescript.tablePrimaryKey);
            }

            System.Windows.MessageBox.Show("生成成功");
        }

        /// <summary>
        /// 获取表的基本信息
        /// </summary>
        /// <param name="content"></param>
        private TableDescript getTablesDescript(string content, bool? isPascal)
        {
            //获取表名称
            TableDescript tableDescript = getTableNameAndChinese(content, isPascal);
            //获取表格字段名称
            tableDescript = getTableField(tableDescript, content, (bool)isPascal);

            return tableDescript;
        }

        /// <summary>
        /// 获取表格字段信息
        /// </summary>
        /// <param name="tableDescript"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        private TableDescript getTableField(TableDescript tableDescript, string content, Boolean isPascal)
        {
            List<TableField> list = new List<TableField>();
            MatchCollection matchesNull = Regex.Matches(content, @"`(\w+?)` (.+?) DEFAULT NULL COMMENT '(.+?)',", RegexOptions.ECMAScript);
            foreach (Match item in matchesNull)
            {
                TableField table = new TableField(isPascal);
                table.Name = item.Groups[1].Value;
                table.Type = item.Groups[2].Value;
                table.Descript = item.Groups[3].Value;
                list.Add(table);
            }

            tableDescript.tableFields = list;
            return tableDescript;
        }

        //根据内容获取表名称及表的中文名称
        private TableDescript getTableNameAndChinese(string content, bool? isPascal)
        {
            TableDescript tableDescript = new TableDescript();

            //获取表名称相关
            Match match = Regex.Match(content, @"CREATE TABLE `(\w+?)`", RegexOptions.ECMAScript);
            string tableName = match.Groups[1].Value;
            tableDescript.tableName = tableName;
            tableDescript.tableNameUpper = (bool)isPascal ? Utils.ToHump(tableName) : Utils.ToFirstUpper(tableName);

            Match match1 = Regex.Match(content, @"CHARSET=utf8 COMMENT='([^\x00-\xff]+?)';", RegexOptions.ECMAScript);
            tableDescript.tableNameChinese = match1.Groups[1].Value;


            //获取主键
            Match matchPrimaryKey = Regex.Match(content, @"PRIMARY KEY \(`(\w+?)`\)", RegexOptions.ECMAScript);
            string tablePrimaryKey = matchPrimaryKey.Groups[1].Value;

            tableDescript.tablePrimaryKey = tablePrimaryKey;
            tableDescript.tablePrimaryKeyUpper = (bool)isPascal ? Utils.ToHump(tablePrimaryKey) : Utils.ToFirstUpper(tablePrimaryKey);

            return tableDescript;
        }

        private void generateNoPascalCrud(string folder, string tableName, string tableNameUpper, string tableNameChinese, List<TableField> list, string tablePrimaryKey)
        {
            #region 生成详情页面


            string template = @"{
                title: '#{fileld_comment}',
                value: #{fileld_name}
            },";

            StringBuilder detailsDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = template.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", "record." + item.Name) + "\n\t\t\t";
                detailsDescript.Append(str);
            }
            string details = File.ReadAllText("template/crud/Details.js");
            details = details.Replace("#{descript}", detailsDescript.ToString());

            string pagesPath = folder + "/pages";
            if (!Directory.Exists(pagesPath))
            {
                Directory.CreateDirectory(pagesPath);
            }

            File.WriteAllText(pagesPath + "/Details.js", details);



            #endregion

            #region 生成编辑增加页面

            //1.生成编辑中的列表

            string templateEdit = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请填写#{fileld_comment}',
                    width: '75%',
                    message: '请填写#{fileld_comment}',
                    sm: 8,
                    initialValue: record.#{fileld_name},
                    ...formItemLayout
                },";






            StringBuilder editDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateEdit.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                editDescript.Append(str);
            }
            string editFile = File.ReadAllText("template/crud/Add.js");
            editFile = editFile.Replace("#{descript}", editDescript.ToString());

            editFile = editFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey);

            File.WriteAllText(pagesPath + "/Add" + tableNameUpper + ".js", editFile);

            #endregion


            #region 生成主页
            string templateIndex = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请输入#{fileld_comment}',
                    width: #{fileld_width}
                },";
            string templateColumns = @"{
                    title: '#{fileld_comment}',
                    dataIndex: '#{fileld_name}',
                    width: #{fileld_width}
                },";

            StringBuilder indexDescript = new StringBuilder();
            StringBuilder columns = new StringBuilder();

            int tableWidth = 0;

            foreach (var item in list)
            {
                int width = getWidth(item.Descript);
                tableWidth += width;

                string str = templateIndex.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name).Replace("#{fileld_width}", width.ToString()) + "\n\t\t\t\t";

                indexDescript.Append(str);

                string col = templateColumns.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name).Replace("#{fileld_width}", width.ToString()) + "\n\t\t\t\t";
                columns.Append(col);
            }

            tableWidth += 180;

            string indexFile = File.ReadAllText("template/crud/index.js");
            indexFile = indexFile.Replace("#{descript}", indexDescript.ToString());
            indexFile = indexFile.Replace("#{columns_fileld}", columns.ToString());
            indexFile = indexFile.Replace("#{tableWidth}", tableWidth.ToString());
            //#{tableWidth}  tableWidth


            indexFile = indexFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(pagesPath + "/index.js", indexFile);



            #endregion



            #region 生成models目录
            string modelsPath = folder + "/pages/models";
            if (!Directory.Exists(modelsPath))
            {
                Directory.CreateDirectory(modelsPath);
            }

            string modelsFile = File.ReadAllText("template/crud/models.js");


            modelsFile = modelsFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(modelsPath + "/" + tableName + ".js", modelsFile);



            #endregion

            #region 生成services目录
            string servicesPath = folder + "/services";
            if (!Directory.Exists(servicesPath))
            {
                Directory.CreateDirectory(servicesPath);
            }

            string servicesFile = File.ReadAllText("template/crud/services.js");


            servicesFile = servicesFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(servicesPath + "/" + tableName + ".js", servicesFile);

            #endregion
        }


        /// <summary>
        /// 2.0版本：1.增加对新增编辑的优化，2.增加对mock的支持
        /// </summary>
        /// <param name="folder"></param>
        /// <param name="tableName"></param>
        /// <param name="tableNameUpper"></param>
        /// <param name="tableNameChinese"></param>
        /// <param name="list"></param>
        /// <param name="tablePrimaryKey"></param>
        private void generateNoPascalCrudV2(string folder, string tableName, string tableNameUpper, string tableNameChinese, List<TableField> list, string tablePrimaryKey)
        {
            #region 生成详情页面


            string template = @"{
                title: '#{fileld_comment}',
                value: #{fileld_name}
            },";

            StringBuilder detailsDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = template.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", "record." + item.Name) + "\n\t\t\t";
                detailsDescript.Append(str);
            }
            string details = File.ReadAllText("template/crudv2/Details.js");
            details = details.Replace("#{descript}", detailsDescript.ToString());

            string pagesPath = folder + "/pages";
            if (!Directory.Exists(pagesPath))
            {
                Directory.CreateDirectory(pagesPath);
            }

            File.WriteAllText(pagesPath + "/Details.js", details);



            #endregion

            #region 生成编辑增加页面

            //1.生成编辑中的列表

            string templateEdit = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请填写#{fileld_comment}',
                    width: '75%',
                    message: '请填写#{fileld_comment}',
                    sm: 8,
                    initialValue: record.#{fileld_name},
                    ...formItemLayout
                },";






            StringBuilder editDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateEdit.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                editDescript.Append(str);
            }
            string editFile = File.ReadAllText("template/crudv2/Add.js");
            editFile = editFile.Replace("#{descript}", editDescript.ToString());

            editFile = editFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(pagesPath + "/Edit" + tableNameUpper + ".js", editFile);

            #endregion


            #region 生成主页
            string templateIndex = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请输入#{fileld_comment}',
                    width: #{fileld_width}
                },";
            string templateColumns = @"{
                    title: '#{fileld_comment}',
                    dataIndex: '#{fileld_name}',
                    width: #{fileld_width}
                },";

            StringBuilder indexDescript = new StringBuilder();
            StringBuilder columns = new StringBuilder();

            int tableWidth = 0;

            foreach (var item in list)
            {
                int width = getWidth(item.Descript);
                tableWidth += width;

                string str = templateIndex.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name).Replace("#{fileld_width}", width.ToString()) + "\n\t\t\t\t";

                indexDescript.Append(str);

                string col = templateColumns.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name).Replace("#{fileld_width}", width.ToString()) + "\n\t\t\t\t";
                columns.Append(col);
            }

            tableWidth += 180;

            string indexFile = File.ReadAllText("template/crudv2/index.js");
            indexFile = indexFile.Replace("#{descript}", indexDescript.ToString());
            indexFile = indexFile.Replace("#{columns_fileld}", columns.ToString());
            indexFile = indexFile.Replace("#{tableWidth}", tableWidth.ToString());
            //#{tableWidth}  tableWidth


            indexFile = indexFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(pagesPath + "/index.js", indexFile);



            #endregion



            #region 生成models目录
            string modelsPath = folder + "/pages/models";
            if (!Directory.Exists(modelsPath))
            {
                Directory.CreateDirectory(modelsPath);
            }

            string modelsFile = File.ReadAllText("template/crudv2/models.js");


            modelsFile = modelsFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(modelsPath + "/" + tableName + ".js", modelsFile);



            #endregion

            #region 生成services目录
            string servicesPath = folder + "/services";
            if (!Directory.Exists(servicesPath))
            {
                Directory.CreateDirectory(servicesPath);
            }

            string servicesFile = File.ReadAllText("template/crudv2/services.js");


            servicesFile = servicesFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(servicesPath + "/" + tableName + ".js", servicesFile);

            #endregion


            #region 生成Mock文件
            string mockPath = folder + "/mock";
            if (!Directory.Exists(mockPath))
            {
                Directory.CreateDirectory(mockPath);
            }

            string mockFile = File.ReadAllText("template/crudv2/mock.js");

            string mockJson = getMockJsonString(list);


            mockFile = mockFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{tableNameChinese}", tableNameChinese).Replace("#{mockJSON}", mockJson);

            File.WriteAllText(mockPath + "/" + tableName + ".js", mockFile);

            #endregion

        }

        /// <summary>
        /// 根据字段名生成mock数据
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        private string getMockJsonString(List<TableField> list)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("{");

            for (int i = 0; i < list.Count; i++)
            {
                var item = list[i];
                string line = " '#{fieldName}': '#{fieldNameChinese}',";
                line = line.Replace("#{fieldName}", item.Name).Replace("#{fieldNameChinese}", item.Descript);
                sb.AppendLine(line);
            }
            sb.AppendLine("}");

            return sb.ToString();
        }

        private int getWidth(string v)
        {
            string str = v.Replace("(", String.Empty).Replace(")", String.Empty).Replace("（", String.Empty).Replace("）", String.Empty);

            return str.Length * 40;
        }

        /// <summary>
        /// 生成只展示筛选和列表数据的代码
        /// </summary>
        /// <param name="folder">选择的生成目录</param>
        /// <param name="tableName">表名</param>
        /// <param name="tableNameUpper">表名首字母大写</param>
        /// <param name="tableNameChinese">表名中文</param>
        /// <param name="list">字段的集合</param>
        /// <param name="tablePrimaryKey">表格主键</param>
        private static void generateEmpty(String folder, String tableName, String tableNameUpper, String tableNameChinese, List<TableField> list, String tablePrimaryKey)
        {

            #region 生成详情页面


            string template = @"{
                title: '#{fileld_comment}',
                value: #{fileld_name}
            },";

            StringBuilder detailsDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = template.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", "record." + item.Name) + "\n\t\t\t";
                detailsDescript.Append(str);
            }

            string pagesPath = folder + "/pages";
            if (!Directory.Exists(pagesPath))
            {
                Directory.CreateDirectory(pagesPath);
            }




            #endregion

            #region 生成编辑增加页面

            //1.生成编辑中的列表

            string templateEdit = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请填写#{fileld_comment}',
                    width: '75%',
                    required: true,
                    message: '请填写#{fileld_comment}',
                    sm: 8,
                    initialValue: record.#{fileld_name},
                    ...formItemLayout
                },";

            StringBuilder editDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateEdit.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                editDescript.Append(str);
            }

            #endregion


            #region 生成主页
            string templateIndex = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请输入#{fileld_comment}',
                    width: 300
                },";
            string templateColumns = @"{
                    title: '#{fileld_comment}',
                    dataIndex: '#{fileld_name}'
                },";

            StringBuilder indexDescript = new StringBuilder();
            StringBuilder columns = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateIndex.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                indexDescript.Append(str);

                string col = templateColumns.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                columns.Append(col);
            }
            string indexFile = File.ReadAllText("template/empty/index.js");
            indexFile = indexFile.Replace("#{descript}", editDescript.ToString());
            indexFile = indexFile.Replace("#{columns_fileld}", columns.ToString());


            indexFile = indexFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(pagesPath + "/index.js", indexFile);



            #endregion



            #region 生成models目录
            string modelsPath = folder + "/pages/models";
            if (!Directory.Exists(modelsPath))
            {
                Directory.CreateDirectory(modelsPath);
            }

            string modelsFile = File.ReadAllText("template/empty/models.js");


            modelsFile = modelsFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(modelsPath + "/" + tableName + ".js", modelsFile);



            #endregion

            #region 生成services目录
            string servicesPath = folder + "/services";
            if (!Directory.Exists(servicesPath))
            {
                Directory.CreateDirectory(servicesPath);
            }

            string servicesFile = File.ReadAllText("template/empty/services.js");


            servicesFile = servicesFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(servicesPath + "/" + tableName + ".js", servicesFile);

            #endregion
        }




        /// <summary>
        /// 生成增删改差的代码方法
        /// </summary>
        /// <param name="folder">选择的生成目录</param>
        /// <param name="tableName">表名</param>
        /// <param name="tableNameUpper">表名首字母大写</param>
        /// <param name="tableNameChinese">表名中文</param>
        /// <param name="list">字段的集合</param>
        /// <param name="tablePrimaryKey">表格主键</param>
        private static void generateCrud(String folder, String tableName, String tableNameUpper, String tableNameChinese, List<TableField> list, String tablePrimaryKey)
        {

            #region 生成详情页面


            string template = @"{
                title: '#{fileld_comment}',
                value: #{fileld_name}
            },";

            StringBuilder detailsDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = template.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", "record." + item.Name) + "\n\t\t\t";
                detailsDescript.Append(str);
            }
            string details = File.ReadAllText("template/crud/Details.js");
            details = details.Replace("#{descript}", detailsDescript.ToString());

            string pagesPath = folder + "/pages";
            if (!Directory.Exists(pagesPath))
            {
                Directory.CreateDirectory(pagesPath);
            }

            File.WriteAllText(pagesPath + "/Details.js", details);



            #endregion

            #region 生成编辑增加页面

            //1.生成编辑中的列表

            string templateEdit = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请填写#{fileld_comment}',
                    width: '75%',
                    required: true,
                    message: '请填写#{fileld_comment}',
                    sm: 8,
                    initialValue: record.#{fileld_name},
                    ...formItemLayout
                },";

            StringBuilder editDescript = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateEdit.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                editDescript.Append(str);
            }
            string editFile = File.ReadAllText("template/crud/Add.js");
            editFile = editFile.Replace("#{descript}", editDescript.ToString());

            editFile = editFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey);

            File.WriteAllText(pagesPath + "/Add" + tableNameUpper + ".js", editFile);

            #endregion


            #region 生成主页
            string templateIndex = @"{
                    type: 'input',
                    label: '#{fileld_comment}',
                    field: '#{fileld_name}',
                    placeholder: '请输入#{fileld_comment}',
                    width: 300
                },";
            string templateColumns = @"{
                    title: '#{fileld_comment}',
                    dataIndex: '#{fileld_name}'
                },";

            StringBuilder indexDescript = new StringBuilder();
            StringBuilder columns = new StringBuilder();

            foreach (var item in list)
            {
                string str = templateIndex.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                indexDescript.Append(str);

                string col = templateColumns.Replace("#{fileld_comment}", item.Descript).Replace("#{fileld_name}", item.Name) + "\n\t\t\t\t";
                columns.Append(col);
            }
            string indexFile = File.ReadAllText("template/crud/index.js");
            indexFile = indexFile.Replace("#{descript}", indexDescript.ToString());
            indexFile = indexFile.Replace("#{columns_fileld}", columns.ToString());


            indexFile = indexFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(pagesPath + "/index.js", indexFile);



            #endregion



            #region 生成models目录
            string modelsPath = folder + "/pages/models";
            if (!Directory.Exists(modelsPath))
            {
                Directory.CreateDirectory(modelsPath);
            }

            string modelsFile = File.ReadAllText("template/crud/models.js");


            modelsFile = modelsFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(modelsPath + "/" + tableName + ".js", modelsFile);



            #endregion

            #region 生成services目录
            string servicesPath = folder + "/services";
            if (!Directory.Exists(servicesPath))
            {
                Directory.CreateDirectory(servicesPath);
            }

            string servicesFile = File.ReadAllText("template/crud/services.js");


            servicesFile = servicesFile.Replace("#{tableName}", tableName).Replace("#{tableNameUpper}", tableNameUpper).Replace("#{primaryKey}", tablePrimaryKey).Replace("#{tableNameChinese}", tableNameChinese);

            File.WriteAllText(servicesPath + "/" + tableName + ".js", servicesFile);

            #endregion
        }


        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            FolderBrowserDialog m_Dialog = new FolderBrowserDialog();
            DialogResult result = m_Dialog.ShowDialog();

            if (result == System.Windows.Forms.DialogResult.Cancel)
            {
                return;
            }
            string dir = m_Dialog.SelectedPath.Trim();
            labelFolder.Content = dir;
        }






    }
}
