// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AzureLens.Models;
using System.Net.Http;
using System.Web.Http;

namespace AzureLens.Controllers
{
    public class DiagramsACLController : Controller
    {

        // GET api/diagrams/DEFG12345/ACL/
        public List<Diagram.ACL> Get(Guid diagramId)
        {
            List<Diagram.ACL> acl = new List<Diagram.ACL>();
            return acl;
        }

        // GET api/diagrams/DEFG12345/ACL/UserABC123
        public Diagram.ACL Get(Guid id, string userName)
        {
            Diagram.ACL acl = new Diagram.ACL();
            return acl;
        }

        // POST api/diagrams/DEFG12345/ACL
        public void Post([FromBody]List<Diagram.ACL> acl)
        {
            //...
        }

        // PUT api/diagrams/DEFG12345/ACL/UserABC123
        public void Put(Guid diagramId, string userId, [FromBody]Diagram.ACL acl)
        {
            //...
        }

        // DELETE api/diagrams/DEFG12345/ACL/UserABC123
        public void Delete(Guid diagramId, string userId)
        {
            //...
        }

    }
}
//*********************************************************   
//   
//AzureLens.Net, https://github.com/matvelloso/azurelens 
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  




// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  




// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   
