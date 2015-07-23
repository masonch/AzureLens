using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AzureLens.Models
{
    partial class Diagram
    {
        public class Deployment
        {
            public int id { get; set; }
            public DateTime timestamp { get; set; }
            public string status { get; set; }
            public string userName { get; set; }

            public DateTime created
            {
                get
                {
                    throw new System.NotImplementedException();
                }

                set
                {
                }
            }
        }
    }
}
