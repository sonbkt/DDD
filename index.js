"use strict";

class Database {
    constructor(initialData) {
        this.data = initialData;
    }

    getAuthors() {
        return this.data.authors;
    }

    getPosts() {
        return this.data.posts;
    }

    getAuthor(authorId) {
        return this.data.authors[authorId];
    }

    getPost(postId) {
        return this.data.posts[postId];
    }

    savePost(postData) {
        this.data["006"] = postData;
    }
}

class Author {
    constructor(name, dateOfBirth) {
        this.name        = name;
        this.dateOfBirth = dateOfBirth;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    getAge() {
        return new Date() - this.dateOfBirth;
    }

    writePost(title, content) {
        return new Post(title, content, this, new Date());
    }
}

class Post {
    constructor(title, content, author, postDate) {
        this.title      = title;
        this.content    = content;
        this.author     = author;
        this.postDate   = postDate;
    }
}

class AuthorFactory {
    factory(rawAuthorData) {
        let author = new Author(rawAuthorData.name, rawAuthorData.dateOfBirth);
        author.setId("001");
        return author;
    }
}

class PostSerializer {
    serialize(post) {
        return {
            title: post.title,
            content: post.content,
            postDate: post.postDate,
            authorId: post.author.getId()
        }
    }
}

class WritingPostService {
    constructor(database, serializer) {
        this.database   = database;
        this.serializer = serializer;
    }

    writePost(author, title, content) {
        let post = author.writePost(title, content);
        this.database.savePost(this.serializer.serialize(post));
        return post;
    }
}

class AuthorRepository {

    constructor(database, factory) {
        this.database = database;
        this.factory = factory;
    }

    getAuthor(authorId) {
        return this.factory.factory(this.database.getAuthor(authorId));
    }
}

/// Boot
let database = new Database({
    authors: {
        "001": {
            name: 'rikky',
            dateOfBirth: new Date()
        },
        "002": {
            name: 'hanny',
            dateOfBirth: new Date()
        },
    },
    posts: {
        "post1": {
            title: "Hello World",
            content: "Some content",
            postDate: new Date(),
            authorId: "001"
        },
        "post2": {
            title: "Hello World 2",
            content: "Some content 2",
            postDate: new Date(),
            authorId: "002"
        }
    }
})

let writingPostService = new WritingPostService(database, new PostSerializer());
let authorRepository = new AuthorRepository(database, new AuthorFactory());

// Run time

let author = authorRepository.getAuthor("001");
writingPostService.writePost(author, "Some Title", "Some Content");
console.log(database.data);
