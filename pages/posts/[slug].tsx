import React from 'react'
import { getMDXExport } from 'mdx-bundler/client'
import { getAllPosts, getSinglePost } from '../../utils/mdx'
import Link, { LinkProps } from 'next/link'

const CustomLink = ({
  as,
  href,
  ...otherProps
}: Pick<LinkProps, 'as' | 'href'> &
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  return (
    <Link as={as} href={href}>
      <a {...otherProps} />
    </Link>
  )
}

const Post = ({ code, frontmatter }: { code: string; frontmatter: { [key: string]: any } }) => {
  // types don't work correctly with getMDXComponent, so use getMDXExport instead
  const Component = React.useMemo(() => getMDXExport(code).default, [code])
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
