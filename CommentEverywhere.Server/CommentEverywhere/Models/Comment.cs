using System;

namespace CommentEverywhere.Models
{
    public class Comment
    {
        public Guid Id { get; set; }

        public string Url { get; set; }

        public int UrlHash { get; set; }

        public string Username { get; set; }

        public string Text { get; set; }

        public DateTime Added { get; set; }
    }
}