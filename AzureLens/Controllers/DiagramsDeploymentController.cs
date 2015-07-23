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
    public class DiagramsDeploymentController : ApiController
    {

        // GET api/diagrams/DIAG12345/deployments/
        public List<Diagram.Deployment> Get(Guid diagramId)
        {
            List<Diagram.Deployment> deployments = new List<Diagram.Deployment>();
            //...
            return deployments;
        }

        // GET api/diagrams/DIAG12345/deployments/1
        public Diagram.Deployment Get(Guid diagramId, int deploymentId)
        {
            Diagram.Deployment deployment = new Diagram.Deployment();
            //...
            return deployment;
        }

        // POST api/diagrams/DIAG12345/deployments
        public void Post([FromBody]Diagram.Deployment deployment)
        {
            //...
        }

        // PUT api/diagrams/DIAG12345/deployments/1
        public void Put(Guid diagramId, int deploymentId, [FromBody]Diagram.Deployment deployment)
        {
            //...
        }

        // DELETE api/diagrams/DIAG12345/deployments/1
        public void Delete(Guid diagramId, int deploymentId)
        {
            ///...
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
