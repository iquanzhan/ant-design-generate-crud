using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AntDesignGenerateCode.utils
{
    public static class Utils
    {
        /// <summary>
        /// 下划线转换成驼峰命名
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToHump(string value)
        {
            Match mt = Regex.Match(value, @"_(\w*)*");
            while (mt.Success)
            {
                var item = mt.Value;
                while (item.IndexOf('_') >= 0)
                {
                    string newUpper = item.Substring(item.IndexOf('_'), 2);
                    item = item.Replace(newUpper, newUpper.Trim('_').ToUpper());
                    value = value.Replace(newUpper, newUpper.Trim('_').ToUpper());
                }
                mt = mt.NextMatch();
            }

            return value;
        }

        /// <summary>
        /// 首字母大写
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToFirstUpper(string value)
        {
            if (String.IsNullOrEmpty(value))
            {
                return "";
            }
            return value.Substring(0, 1).ToUpper() + value.Substring(1);
        }
    }
}
