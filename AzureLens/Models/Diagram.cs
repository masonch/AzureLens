using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AzureLens.Models
{
    public partial class Diagram
    {
        public Guid id { get; set; }
        public string type { get; set; }
        public string Name { get; set; }
        public string description { get; set; }
        public bool isShareable { get; set; }
        public int isProtected { get; set; }        
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public string Author { get; set; }

        public List<AzureLens.Models.Diagram.ACL> ACLs { get; set; }
        public List<AzureLens.Models.Diagram.Deployment> Deployments { get; set; }
        public List<AzureLens.Models.Diagram.Layout> Layouts { get; set; }
    }
}