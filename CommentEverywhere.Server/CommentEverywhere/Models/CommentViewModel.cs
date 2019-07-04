using System;

namespace CommentEverywhere.Models
{
    public class CommentViewModel
    {
        public string Username { get; set; }

        public string Text { get; set; }

        public DateTime Added { get; set; }
    }
}