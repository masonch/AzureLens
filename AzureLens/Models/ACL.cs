using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AzureLens.Models
{
    partial class Diagram
    {
        public bool isShareable
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int isProtected
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public class ACL
        {
            public string userName { get; set; }
            public bool canRead { get; set; }
            public bool canWrite { get; set; }
            public bool canShare { get; set; }

            public int id
            {
                get
                {
                    throw new System.NotImplementedException();
                }

                set
                {
                }
            }

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

            public DateTime updated
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