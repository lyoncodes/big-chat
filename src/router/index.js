import PageHome from '@/components/PageHome'
import PageThreadShow from '@/components/PageThreadShow'
import PageNotFound from '@/components/PageNotFound'
import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: PageThreadShow,
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
          name: 'PageNotFound',
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
    name: 'PageNotFound',
    component: PageNotFound,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
