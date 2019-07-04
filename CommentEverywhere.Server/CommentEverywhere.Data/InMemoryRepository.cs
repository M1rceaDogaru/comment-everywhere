using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommentEverywhere.Data
{
    public class InMemoryRepository<T>
    {
        private static InMemoryRepository<T> _instance = new InMemoryRepository<T>();

        public InMemoryRepository<T> Instance => _instance;

        private InMemoryRepository()
        {
        }

        public void Add()
    }
}
