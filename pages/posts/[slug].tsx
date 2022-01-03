import React from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import { getAllPosts, getSinglePost } from '../../utils/mdx'
import Link from 'next/link'

const CustomLink = ({ as, href, ...otherProps }) => {
  return (
    <Link as={as} href={href} className="custom-link">
      <a {...otherProps} />
    </Link>
  )
}

const Post = ({ code, frontmatter }: { code: string; frontmatter: { [key: string]: any } }) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <div className="wrapper">
      <h1>{frontmatter.title}</h1>
      <Component
        components={{
          a: CustomLink,
        }}
      />
    </div>
  )
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const post = await getSinglePost(params.slug)
  return {
    props: { ...post },
  }
}

export const getStaticPaths = async () => {
  const paths = getAllPosts().map(({ slug }) => ({ params: { slug } }))
  return {
    paths,
    fallback: false,
  }
}

export default Post
