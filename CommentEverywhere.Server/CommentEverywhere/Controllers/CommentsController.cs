using CommentEverywhere.DataAccess;
using CommentEverywhere.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace CommentEverywhere.Controllers
{
    public class CommentsController : Controller
    {
        // GET: Comments
        public ActionResult Index(string url)
        {
            var comments = InMemoryRepository.Instance.GetByUrl(url.GetHashCode()).OrderByDescending(comment => comment.Added);

            return Json(comments, JsonRequestBehavior.AllowGet);// PartialView(comments);
        }

        [HttpPost]
        public ActionResult AddComment(Comment comment)
        {
            comment.UrlHash = comment.Url.GetHashCode();
            comment.Added = DateTime.Now;

            InMemoryRepository.Instance.Add(comment);
            return Json(comment);
        } 
    }
}