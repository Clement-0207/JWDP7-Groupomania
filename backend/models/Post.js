class Post {

    constructor(post_id, title, body, written_on, account_id) {
        this.post_id = post_id;
        this.title = title;
        this.body = body;
        this.written_on = written_on;
        this.account_id = account_id;
    }

    constructor(title, body, written_on, account_id) {
        this.title = title;
        this.body = body;
        this.written_on = written_on;
        this.account_id = account_id;
    }

    setComment(comments) {
        this.comments = comments;
    }

    addComment(comment) {
        this.comment.push(comment);
    }

}