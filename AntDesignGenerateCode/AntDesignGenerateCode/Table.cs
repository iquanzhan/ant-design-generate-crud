using AntDesignGenerateCode.utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AntDesignGenerateCode
{
    public class Table
    {
        public string Type { get; set; }
        public string Descript { get; set; }

        private string name;  

        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name =Utils.ToHump(value);
            }
        }

    }
}
