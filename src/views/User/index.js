import BookMarked from './BookMarked/index.vue';
import Followed from './Followed/index.vue';
import HomePage from './HomePage/index.vue';

export default [
  {
    path: '/users/bookmarked',
    name: 'BookMarked',
    component: BookMarked
  },
  {
    path: '/users/followed',
    name: 'Followed',
    component: Followed
  },
  {
    path: '/users/HomePage',
    name: 'HomePage',
    component: HomePage
  }
];
