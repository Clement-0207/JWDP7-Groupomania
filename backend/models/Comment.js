class Comment {

    constructor(comment_id, comment_body, post_message_id, account_id) {
        this.comment_id = comment_id;
        this.comment_body = comment_body;
        this.post_message_id = post_message_id;
        this.account_id = account_id;
    }

    constructor(comment_body, post_message_id, account_id) {
        this.comment_body = comment_body;
        this.post_message_id = post_message_id;
        this.account_id = account_id;
    }

}