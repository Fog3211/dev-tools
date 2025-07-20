import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy load components
const Home = () => import('@/views/Home.vue')
const JsonFormatter = () => import('@/views/tools/JsonFormatter.vue')
const Base64Tool = () => import('@/views/tools/Base64Tool.vue')
const Md5Tool = () => import('@/views/tools/Md5Tool.vue')
const UrlTool = () => import('@/views/tools/UrlTool.vue')
const CurlTool = () => import('@/views/tools/CurlTool.vue')
const CurlBuilder = () => import('@/views/tools/CurlBuilder.vue')
const CreditCardGenerator = () => import('@/views/tools/CreditCardGenerator.vue')
const ColorConverter = () => import('@/views/tools/ColorConverter.vue')
const ImageUploadCdn = () => import('@/views/tools/ImageUploadCdn.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Developer Tools'
    }
  },
  {
    path: '/json',
    name: 'JsonFormatter',
    component: JsonFormatter,
    meta: {
      title: 'JSON Formatter'
    }
  },
  {
    path: '/base64',
    name: 'Base64Tool',
    component: Base64Tool,
    meta: {
      title: 'Base64 Encoder/Decoder'
    }
  },
  {
    path: '/md5',
    name: 'Md5Tool',
    component: Md5Tool,
    meta: {
      title: 'MD5 Generator'
    }
  },
  {
    path: '/url',
    name: 'UrlTool',
    component: UrlTool,
    meta: {
      title: 'URL Encoder/Decoder'
    }
  },
  {
    path: '/curl',
    name: 'CurlTool',
    component: CurlTool,
    meta: {
      title: 'cURL Filter'
    }
  },
  {
    path: '/curl-builder',
    name: 'CurlBuilder',
    component: CurlBuilder,
    meta: {
      title: 'cURL Builder'
    }
  },
  {
    path: '/credit-card-generator',
    name: 'CreditCardGenerator',
    component: CreditCardGenerator,
    meta: {
      title: 'Credit Card Generator'
    }
  },
  {
    path: '/color-converter',
    name: 'ColorConverter',
    component: ColorConverter,
    meta: {
      title: 'Color Converter'
    }
  },
  {
    path: '/image-upload-cdn',
    name: 'ImageUploadCdn',
    component: ImageUploadCdn,
    meta: {
      title: 'Image Upload CDN'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to: any, _from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard for SEO
router.beforeEach((to: any, _from: any, next: any) => {
  // Update document title and meta tags
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  if (to.meta?.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description as string)
    }
  }
  
  next()
})

export default router 