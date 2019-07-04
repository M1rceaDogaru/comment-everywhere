using CommentEverywhere.Models;
using System.Collections.Generic;
using System.Linq;

namespace CommentEverywhere.DataAccess
{
    public class InMemoryRepository
    {
        private static InMemoryRepository _instance = new InMemoryRepository();

        public static InMemoryRepository Instance => _instance;

        List<Comment> _elements;

        private InMemoryRepository()
        {
            _elements = new List<Comment>();
        }

        public IEnumerable<Comment> GetByUrl(int urlHash)
        {
            return _elements.Where(element => element.UrlHash == urlHash);
        }

        public void Add(Comment element)
        {
            _elements.Add(element);
        }
    }
}
