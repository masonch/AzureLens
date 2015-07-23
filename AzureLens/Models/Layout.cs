using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AzureLens.Models
{
    /// <summary>
    /// TODO: think of a better name than Layouts. maybe Resources???
    /// </summary>
    /// 
    partial class Diagram
    {
        public class Layout
        {
            public int id { get; set; }
            /// <summary>
            /// the x, y coordinaes
            /// </summary>
            public KeyValuePair<string, int> position { get; set; }
            public string status { get; set; }

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

            /// <summary>
            /// the resourceId from Resources (ex. EventHub, SQLDB, DocumentDB, etc...)
            /// </summary>
            public Guid resourceId
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
