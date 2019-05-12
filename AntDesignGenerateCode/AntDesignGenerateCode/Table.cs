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
        private Boolean isNoPascal;

        public Table()
        {
            this.isNoPascal = false;
        }
        public Table(Boolean isNoPascal)
        {
            this.isNoPascal = isNoPascal;
        }

        private string name;

        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                if (!this.isNoPascal)
                {
                    name = Utils.ToHump(value);
                }
                else
                {
                    name = value;
                }

            }
        }

    }
}
