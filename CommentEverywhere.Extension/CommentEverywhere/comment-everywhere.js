(function () {
    const SERVER_URL = "http://localhost:19379/";
    const CE_PANEL_ID = "ce-panel";
    const CE_CONTENT_ID = "ce-content";
    const CE_INPUT_ID = "ce-comment-input";
    const CE_SEND_ID = "ce-comment-send";
    const MSG_CANNOT_GET_COMMENTS = "<p>Sorry, could not get the comments. :(</p>";

    function ajaxGet(url, callback) {
        var xmlhttp;
        // compatible with IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    callback(xmlhttp.responseText);                    
                } else {
                    callback(MSG_CANNOT_GET_COMMENTS);                    
                }
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function alternateAjaxGet(url, callback) {
        var request = new Request(url);

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default' };

        fetch(request, myInit).then(function (response) {
            if (response.ok) {
                return response.json().then(function (content) {
                    callback(content);
                });
            } else {
                callback(MSG_CANNOT_GET_COMMENTS);
            }
        });
    }

    function alternateAjaxPost(url, data, callback) {
        var request = new Request(url);

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var myInit = { method: 'POST',
                    body: data,
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default' };

        fetch(request, myInit).then(function (response) {
            if (response.ok) {
                return response.json().then(function (content) {
                    callback(content);
                });
            } else {
                callback(MSG_CANNOT_GET_COMMENTS); //this is not right. FIX!!!!
            }
        });
    }

    function onCommentButtonClicked() {
        fetchComments();
    }

    function onCloseButtonClicked() {
        var cePanel = document.getElementById(CE_PANEL_ID);
        cePanel.style.visibility = "hidden";
    }

    function onSendButtonClicked() {
        var input = document.getElementById(CE_INPUT_ID);
        var commentText = input.value;

        var commentObject = {
            url: window.location.href,
            username: "test_user", //this needs to be handled on server side based on auth token 
            text: commentText
        };

        alternateAjaxPost(SERVER_URL + "comments/addcomment", JSON.stringify(commentObject), onCommentPosted)
    }

    function onCommentPosted() {
        var input = document.getElementById(CE_INPUT_ID);
        input.value = "";
        fetchComments();
    }

    function renderResponse(responseText) {
        var cePanel = document.getElementById(CE_PANEL_ID) || createCePanel();        
        cePanel.style.visibility = "visible";
        document.getElementById(CE_CONTENT_ID).innerHTML = responseText;
    }

    function fetchComments() {
        renderResponse("<p>Please wait while we fetch the comments...</p>");
        alternateAjaxGet(SERVER_URL + "comments?url=" + encodeURIComponent(window.location.href), renderComments);
    }

    function renderComments(comments) {
        var result = "";

        if (!comments || comments.length == 0) {
            result = "<p>Aww, no comments added...yet.</p>";
        } else {
            var result = '<div>';

            //TODO: turn this into a generic template using a replace implementation
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i];
                var added = new Date(parseInt(comment.Added.match(/\d+/)[0]));
                result += "<span>" + comment.Username + " said on " + added.toUTCString() + "</span></br>";
                result += '<span style="width: 400px; overflow-wrap:break-word">' + comment.Text + '</span><hr/>'; //get this style out of here!!!!
            }

            result += "</div>";
        }

        renderResponse(result);
    }
    
    function createCePanel() {
        var cePanel = document.createElement("div");
        cePanel.id = CE_PANEL_ID;
        cePanel.style.position = "fixed";
        cePanel.style.right = "20px";
        cePanel.style.bottom = "20px";

        cePanel.style.backgroundColor = "#e6f7ff";
        cePanel.style.width = "400px";
        cePanel.style.height = "400px";
        cePanel.style.borderWidth = "5px";
        cePanel.style.borderColor = "#66ccff";
        cePanel.style.borderRadius = "10px";
        cePanel.style.zIndex = 9998;

        var closeButton = document.createElement("div");
        closeButton.id = "ce-close-button";
        closeButton.innerText = "X";
        closeButton.style.position = "fixed";
        closeButton.style.right = "25px";
        closeButton.style.bottom = "395px";
        closeButton.style.width = "25px";
        closeButton.style.textAlign = "center";
        closeButton.style.backgroundColor = "#1a75ff";
        closeButton.style.borderRadius = "15px";
        closeButton.style.zIndex = 9999;
        closeButton.style.cursor = "pointer";

        closeButton.onclick = onCloseButtonClicked;

        var contentContainer = document.createElement("div");
        contentContainer.id = CE_CONTENT_ID;
        contentContainer.style.width = "400px";
        contentContainer.style.height = "350px";
        contentContainer.style.overflow = "auto";

        var commentInput = document.createElement("input");
        commentInput.id = CE_INPUT_ID;
        commentInput.type = "text";

        var commentSend = document.createElement("button");
        commentSend.id = CE_SEND_ID;
        commentSend.textContent = "SEND";
        commentSend.onclick = onSendButtonClicked;

        cePanel.appendChild(closeButton);
        cePanel.appendChild(contentContainer);
        cePanel.appendChild(commentInput);
        cePanel.appendChild(commentSend);
        document.body.appendChild(cePanel);

        return cePanel;
    }

    function createCommentsButton() {
        var button = document.createElement("img");
        button.src = browser.extension.getURL("icons/ce-48.png");

        button.style.position = "fixed";
        button.style.right = "20px";
        button.style.bottom = "20px";
        button.style.borderRadius = "10px";
        button.style.zIndex = 9997;
        button.style.cursor = "pointer";
        
        button.onclick = onCommentButtonClicked;

        document.body.appendChild(button);
    }

    createCommentsButton();
})();
