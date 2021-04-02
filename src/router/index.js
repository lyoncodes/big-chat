import Home from '@/pages/Home'
import ThreadShow from '@/pages/ThreadShow'
import NotFound from '@/pages/NotFound'
import Forum from '@/pages/Forum'
import Category from '@/pages/Category'
import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,
    // check if route exists
    beforeEnter (to, from, next) {
      const threadExists = sourceData.threads.find(t => t.id === to.params.id)
      // if exists, continue
      if (threadExists) {
        return next()
      } else {
        // if doesn't exist, direct user to not found
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          // preserve the existing query and hash in url when route not matched
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
