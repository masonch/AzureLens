using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AzureLens.Models
{
    /// <summary>
    /// TODO: think about Authorization for menus. Need to be able to restrict certain menus from certain users
    /// </summary>
    public class Menu
    {
        public Guid id { get; set; }

        public string menu
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public string description
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int parentId
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

        public Int16 sequence
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