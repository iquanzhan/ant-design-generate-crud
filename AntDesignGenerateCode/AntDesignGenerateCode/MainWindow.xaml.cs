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

            Boolean isNoPascal = index == 2;



            string content = txtContent.Text;

            #region 获取表名及表名称

            Match match = Regex.Match(content, @"CREATE TABLE `(\w+?)`", RegexOptions.ECMAScript);
            string tableName = match.Groups[1].Value;
            if (!isNoPascal)
            {
                tableName = Utils.ToHump(tableName);
            }


            string tableNameUpper = tableName.Substring(0, 1).ToUpper() + tableName.Substring(1);


            Match match1 = Regex.Match(content, @"CHARSET=utf8 COMMENT='([^\x00-\xff]+?)';", RegexOptions.ECMAScript);
            string tableNameChinese = match1.Groups[1].Value;

            #endregion

            #region 获取主键

            Match matchPrimaryKey = Regex.Match(content, @"PRIMARY KEY \(`(\w+?)`\)", RegexOptions.ECMAScript);
            string tablePrimaryKey = matchPrimaryKey.Groups[1].Value;

            if (!isNoPascal)
            {
                tablePrimaryKey = Utils.ToHump(tablePrimaryKey);
            }

            #endregion

            #region 获取字段类型及其中文名称

            List<Table> list = new List<Table>();

            MatchCollection matchesNotNull = Regex.Matches(content, @"`(\w+?)` (\w+?)\(\d+?\) NOT NULL COMMENT '(.+?)',", RegexOptions.ECMAScript);
            MatchCollection matchesNull = Regex.Matches(content, @"`(\w+?)` (.+?) DEFAULT NULL COMMENT '(.+?)',", RegexOptions.ECMAScript);

            foreach (Match item in matchesNotNull)
            {
                Table table = new Table(isNoPascal);
                table.Name = item.Groups[1].Value;
                table.Type = item.Groups[2].Value;
                table.Descript = item.Groups[3].Value;
                list.Add(table);
            }

            foreach (Match item in matchesNull)
            {
                Table table = new Table(isNoPascal);
                table.Name = item.Groups[1].Value;
                table.Type = item.Groups[2].Value;
                table.Descript = item.Groups[3].Value;
                list.Add(table);
            }

            #endregion




            if (index < 0)
            {
                System.Windows.MessageBox.Show("请选择生成模版");
                return;
            }
            if (index == 0)
            {
                generateCrud(folder, tableName, tableNameUpper, tableNameChinese, list, tablePrimaryKey);
            }
            else if (index == 1)
            {
                generateEmpty(folder, tableName, tableNameUpper, tableNameChinese, list, tablePrimaryKey);
            }
            else
            {
                generateNoPascalCrud(folder, tableName, tableNameUpper, tableNameChinese, list, tablePrimaryKey);
            }



            System.Windows.MessageBox.Show("生成成功");

        }

        private void generateNoPascalCrud(string folder, string tableName, string tableNameUpper, string tableNameChinese, List<Table> list, string tablePrimaryKey)
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

        /// <summary>
        /// 生成只展示筛选和列表数据的代码
        /// </summary>
        /// <param name="folder">选择的生成目录</param>
        /// <param name="tableName">表名</param>
        /// <param name="tableNameUpper">表名首字母大写</param>
        /// <param name="tableNameChinese">表名中文</param>
        /// <param name="list">字段的集合</param>
        /// <param name="tablePrimaryKey">表格主键</param>
        private static void generateEmpty(String folder, String tableName, String tableNameUpper, String tableNameChinese, List<Table> list, String tablePrimaryKey)
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
        private static void generateCrud(String folder, String tableName, String tableNameUpper, String tableNameChinese, List<Table> list, String tablePrimaryKey)
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
