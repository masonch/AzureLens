using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace AzureLens.Database.DocumentDB
{
    internal class DocumentDBContext : IDisposable
    {
        private DocumentClient _client;
        private Microsoft.Azure.Documents.Database _database;
        private Mutex _lockMutex = new Mutex();

        private static string QueryByFilter = "QueryByFilter";

        public DocumentDBContext(string collectionName = "")
        {
            CollectionName = collectionName;
        }

        public string CollectionName { get; set; }

        private string ConnectionUrl { get; set; } = ConfigurationManager.AppSettings["DocumentDBURI"];
        private string ConnectionKey { get; set; } = ConfigurationManager.AppSettings["DocumentDBKey"];
        private string DatabaseName { get; set; } = ConfigurationManager.AppSettings["DocumentDBName"];
        private bool IsConnected { get; set; }

        public void Dispose()
        {
            if (_client != null)
            {
                _client.Dispose();
                _client = null;
            }
        }

        public async Task<bool> InsertOrUpdateItemAsync(string collectionName, string jsonDocument)
        {
            var result = false;
            var collection = await GetCollectionAsync(collectionName);
            if (collection == null)
            {
                return result;
            }

            try
            {
                dynamic parsedDocument = JObject.Parse(jsonDocument);
                string docId = parsedDocument.id;
                dynamic dbDoc = _client.CreateDocumentQuery(collection.SelfLink).Where(d => d.Id == docId).AsEnumerable().FirstOrDefault();
                if (dbDoc == null)
                {
                    var document = await _client.CreateDocumentAsync(collection.SelfLink, jsonDocument);
                    result = document != null;
                }
                else
                {
                    var existingItem = dbDoc;
                    existingItem = jsonDocument;
                    var document = await _client.ReplaceDocumentAsync(dbDoc.SelfLink, existingItem);
                    result = document != null;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.ToString());
            }

            return result;
        }

        public async Task<bool> DeleteItemAsync<TItem>(string id, string collectionId)
        {
            var result = false;

            var collection = await GetCollectionAsync(collectionId);
            if (collection == null)
            {
                return result;
            }

            try
            {
                dynamic doc = _client.CreateDocumentQuery(collection.SelfLink).Where(d => d.Id == id).AsEnumerable().FirstOrDefault();
                if (doc == null)
                {
                    result = true;
                }
                else
                {
                    var document = await _client.DeleteDocumentAsync(doc.SelfLink);
                    result = document != null;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.ToString());
            }

            return result;
        }

        internal class FilterResult
        { 
            public Document[] Result { get; set; } 
            public int? Continuation { get; set; } 
        }

        public async Task<List<dynamic>> GetItemsByPropertyAsync<TItem>(string propertyName, string propertyValue)
        {
            List<dynamic> results = new List<dynamic>();
            var collection = await GetCollectionAsync(CollectionName);
            if (collection == null)
            {
                return results;
            }

            try
            {
                StoredProcedure sproc = null;
                sproc = _client.CreateStoredProcedureQuery(collection.StoredProceduresLink, String.Format("select * from root r where r.id = '{0}'", QueryByFilter)).ToList().FirstOrDefault();
                if (sproc == null)
                {
                    sproc = await RegisterQueryByFilterStoredProc(collection);
                    if (sproc == null)
                    {
                        return results;
                    }
                }
                var filterQuery = string.Format(CultureInfo.InvariantCulture, "SELECT * FROM root r where r.{0} = '{1}'", propertyName, propertyValue);
                int? continuationToken = null;

                do
                {
                    var response = await _client.ExecuteStoredProcedureAsync<FilterResult>(sproc.SelfLink, filterQuery, continuationToken);

                    continuationToken = response.Response.Continuation;
                    foreach (var doc in response.Response.Result)
                    {
                        results.Add(doc);
                    }
                } while (continuationToken != null);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.ToString());
            }

            return results;
        }

        public async Task<dynamic> GetItemAsync<TItem>(string id, string collectionId)
        {
            TItem result = default(TItem);
            var collection = await GetCollectionAsync(collectionId);
            if (collection == null)
            {
                return result;
            }

            try
            {
                dynamic dbDoc = _client.CreateDocumentQuery(collection.SelfLink).Where(d => d.Id == id).AsEnumerable().FirstOrDefault();
                if (dbDoc != null)
                {
                    result = dbDoc;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.ToString());
            }

            return result;
        }

        private async Task ConnectAsync()
        {
            _lockMutex.WaitOne();
            if (_client == null)
            {
                IsConnected = false;
                if (string.IsNullOrEmpty(ConnectionUrl))
                {
                    throw new ArgumentNullException(nameof(ConnectionUrl));
                }
                if (string.IsNullOrWhiteSpace(ConnectionKey))
                {
                    throw new ArgumentNullException(nameof(ConnectionKey));
                }
                if (string.IsNullOrWhiteSpace(DatabaseName))
                {
                    throw new ArgumentNullException(nameof(DatabaseName));
                }
                try
                {
                    _client = new DocumentClient(new Uri(ConnectionUrl), ConnectionKey);
                    _database = await GetOrCreateDatabaseAsync(DatabaseName);
                    IsConnected = true;
                }
                catch (DocumentClientException de)
                {
                    var baseException = de.GetBaseException();
                    Debug.WriteLine("{0} error occurred: {1}, Message: {2}", de.StatusCode, de.Message, baseException.Message);
                    _client = null;
                }
                catch (Exception e)
                {
                    var baseException = e.GetBaseException();
                    Debug.WriteLine("Error: {0}, Message: {1}", e.Message, baseException.Message);
                    _client = null;
                }
            }
            _lockMutex.ReleaseMutex();
        }

        private async Task<DocumentCollection> GetCollectionAsync(string collectionId)
        {
            if (string.IsNullOrWhiteSpace(collectionId))
            {
                throw new ArgumentNullException(collectionId);
            }

            await ConnectAsync();

            if (_database == null)
            {
                return null;
            }

            DocumentCollection result = null;
            result = _client.CreateDocumentCollectionQuery(_database.SelfLink)
                            .Where(c => c.Id == collectionId)
                            .AsEnumerable()
                            .FirstOrDefault();

            if (result == null)
            {
                result = await _client.CreateDocumentCollectionAsync(_database.SelfLink, new DocumentCollection { Id = collectionId });
                //await RegisterStoredProcedures(result);
            }

            return result;
        }

        private async Task<Microsoft.Azure.Documents.Database> GetOrCreateDatabaseAsync(string id)
        {
            var db = _client.CreateDatabaseQuery()
                            .Where(d => d.Id == id)
                            .AsEnumerable()
                            .FirstOrDefault();
            if (db == null)
            {
                db = await _client.CreateDatabaseAsync(new Microsoft.Azure.Documents.Database { Id = id });
            }

            return db;
        }

        //private async Task RegisterStoredProcedures(DocumentCollection collection)
        //{
        //    switch (collection.Id.ToLowerInvariant())
        //    {
        //        case "diagrams":
        //            await RegisterDiagramStoredProceduresAsync(collection);
        //            break;
        //    }
        //}

        //private async Task RegisterDiagramStoredProceduresAsync(DocumentCollection collection)
        //{
        //    await RegisterQueryByUserIdSProc(collection.SelfLink);
        //}

        private async Task<StoredProcedure> RegisterQueryByFilterStoredProc(DocumentCollection collection)
        {
            var assembly = System.Reflection.Assembly.GetExecutingAssembly();
            var resourceName = "AzureLens.Database.DocumentDB.js.QueryByFilter.js";

            var body = string.Empty;
            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            using (StreamReader reader = new StreamReader(stream))
            {
                body = reader.ReadToEnd();
            }

            if (string.IsNullOrWhiteSpace(body))
            {
                return null;
            }
            var sproc = new StoredProcedure
            {
                Id = QueryByFilter,
                Body = body
            };

            sproc = await _client.CreateStoredProcedureAsync(collection.SelfLink, sproc);
            return sproc;
        }
    }
}