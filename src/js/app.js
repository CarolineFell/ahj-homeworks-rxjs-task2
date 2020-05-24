/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { interval } from 'rxjs';

const urls = 'https://ahj-homeworks-rxjs-server2.herokuapp.com/';

function addNullToDate(value) {
  const newValue = value < 10 ? `0${value}` : value;
  return newValue;
}

function printDate(valueDate) {
  const newDate = new Date(valueDate);
  const date = addNullToDate(newDate.getDate());
  const months = addNullToDate(newDate.getMonth() + 1);
  const year = addNullToDate(newDate.getFullYear());
  const hours = addNullToDate(newDate.getHours());
  const minutes = addNullToDate(newDate.getMinutes());
  const printedDate = `${hours}:${minutes} ${date}.${months}.${year}`;
  return printedDate;
}

class Posts {
  constructor() {
    this.postsList = document.querySelector('.posts-list');
  }

  printMessages(post) {
    const postItem = document.createElement('li');
    postItem.className = 'post';

    postItem.innerHTML = `
      <div class="author-post">
        <div class="author-post-avatar">
          <img class="author-post-image" src="${post.avatar}">
        </div>
        <div class="author-post-info">
          <div class="author-post-name">${post.author}</div>
          <div class="author-post-date">${printDate(new Date())}</div>
        </div>
      </div>
      <div class="image-post">
        <img src="${post.image}">
      </div>    
      `;
    const commentsList = document.createElement('div');
    commentsList.className = 'comments';
    commentsList.innerHTML = 'Latest comments';
    post.comments.forEach((item) => {
      const commentItem = document.createElement('div');
      commentItem.className = 'comment';

      commentItem.innerHTML = `
        <div class="user-comment-avatar">
          <img class="user-comment-image" src="${item.avatar}">
        </div>
        <div class="user-comment-info">
          <div class="user-comment-name">${item.author}</div>
          <div class="user-comment-text">${item.content}</div>
        </div>    
        <div class="user-comment-date">${printDate(new Date())}</div>
      `;
      commentsList.appendChild(commentItem);
    });

    const loadMore = document.createElement('div');
    loadMore.className = 'load-more';
    loadMore.innerHTML = '<a href="">Load more</a>';
    postItem.appendChild(commentsList);
    postItem.appendChild(loadMore);
    this.postsList.appendChild(postItem);
  }

  getMessages() {
    interval(10000).subscribe(() => {
      const postsLatest = ajax.getJSON(`${urls}posts/latest`)
        .pipe(map((userResponse) => {
          const posts = JSON.parse(userResponse.data);
          this.postsList.innerHTML = '';
          posts.forEach((post) => {
            const commentsLatest = ajax.getJSON(`${urls}posts/${post.author_id}/comments/latest`)
              .pipe(map((item) => {
                post.comments = JSON.parse(item.data);
                this.printMessages(post);
              }))

              .subscribe(commentsLatest);
          });
        }),
        catchError((error) => error))
        .subscribe(postsLatest);
    });
  }

  init() {
    this.getMessages();
  }
}

const posts = new Posts();
posts.init();