import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'

export const POSTS_PATH = path.join(process.cwd(), 'data/_posts')

export const getSourceOfFile = (fileName: string) => {
  return fs.readFileSync(path.join(POSTS_PATH, fileName)) as unknown as string
}

export const getAllPosts = () => {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path))
    .map((fileName) => {
      const source = getSourceOfFile(fileName)
      const slug = fileName.replace(/\.mdx?$/, '')
      const { data } = matter(source)

      return {
        frontmatter: data,
        slug: slug,
      }
    })
}

export const getSinglePost = async (slug: string) => {
  const { code, frontmatter } = await bundleMDX({
    file: `${POSTS_PATH}/${slug}.mdx`,
    cwd: POSTS_PATH,
    esbuildOptions(options) {
      // https://github.com/kentcdodds/mdx-bundler/issues/100
      options.platform = 'node'
      // options.target = ['esnext']
      return options
    },
  })

  return {
    frontmatter,
    code,
  }
}
