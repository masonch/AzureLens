using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AzureLens.Database.DocumentDB;
using System.Threading;
using System.Threading.Tasks;
using AzureLens.Models;

namespace AzureLens.Database
{
    static public class DAL
    {
        static public bool SaveDiagram(string doc)
        {
            dynamic rtnValue = false;
            try
            {
                using (DocumentDBContext docdb = new DocumentDBContext())
                {
                    rtnValue = docdb.InsertOrUpdateItemAsync("AzureLensColl", doc);
                }
            }
            catch
            {
                // handle exception...                
            }
            return rtnValue;
        }

        /// <summary>
        /// Load a list of JSON documents
        /// TODO: will need to filter the result set by User
        /// </summary>
        /// <returns></returns>
        static public List<dynamic> LoadDiagrams()
        {
            List<dynamic> docs = new List<dynamic>();
            using (DocumentDBContext docdb = new DocumentDBContext())
            {
                // test only - load the same JSON doc into a list
                dynamic doc = LoadDiagram(new Guid("b2aea850-eada-2e77-e074-6fe8f099ccf4")); 
                docs.Add(doc);
                docs.Add(doc);
                docs.Add(doc);
                
                //docs = docdb.GetUserItemAsync<dynamic>("beapolin@microsoft.com", "AzureLensColl");
            }
            return docs;
        }

        //static public bool UpdateDiagram(Guid diagramId, string doc)
        //{
        //    using (DocumentDBContext docdb = new DocumentDBContext())
        //    {
        //        dynamic x = docdb.InsertOrUpdateItemAsync("AzureLensColl", doc);
        //    }
        //    return true;
        //}

        static public dynamic LoadDiagram(Guid diagramId)
        {
            dynamic doc = null;
            try
            {
                dynamic id = diagramId.ToString();
                using (DocumentDBContext docdb = new DocumentDBContext())
                {
                    doc = docdb.GetItemAsync<dynamic>(id, "AzureLensColl");
                }
            }
            catch
            {
                // handle exception...                
            }
            return doc.Result;
        }


    }
}