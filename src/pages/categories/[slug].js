import { gql } from '@apollo/client'
import Button from '@components/Button'
import Container from '@components/Container'
import Layout from '@components/Layout'
import styles from '@styles/Page.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { apolloClient } from 'src/clients/apollo'
import { buildImage } from 'src/services/cloudinary'

export default function Category({ category, products }) {
  return (
    <Layout>
      <Head>
        <title>{category.name}</title>
        <meta name="description" content={category.name} />
      </Head>

      <Container>
        <h1>{category.name}</h1>

        <h2>Products</h2>

        <ul className={styles.products}>
          {products.map(({ id, name, price, image, slug }) => {
            const imageUrl = buildImage(image.public_id)
              .resize('w_900,h_900')
              .toURL()

            return (
              <li key={id}>
                <Link href={`/products/${slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        width={image.width}
                        height={image.height}
                        src={imageUrl}
                        alt={name}
                      />
                    </div>
                    <h3 className={styles.productTitle}>{name}</h3>
                    <p className={styles.productPrice}>{price.toFixed(2)}</p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={id}
                    data-item-price={price}
                    data-item-url={`/products/${slug}`}
                    data-item-image={image.url}
                    data-item-name={name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, locales }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageCategory($slug: String) {
        category(where: { slug: $slug }) {
          id
          name
          slug
          products {
            id
            image
            name
            price
            slug
          }
        }
      }
    `,
    variables: {
      slug: params.slug,
    },
  })

  const { category } = data

  return {
    props: {
      category,
      products: category.products,
    },
  }
}

export async function getStaticPaths({ locales }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageCategories {
        categories {
          id
          slug
        }
      }
    `,
  })

  const paths = data.categories.map(({ slug }) => {
    return {
      params: {
        slug,
      },
    }
  })

  return {
    paths: [
      ...paths,
      ...paths.flatMap((path) => {
        return locales.map((locale) => {
          return { ...path, locale }
        })
      }),
    ],
    fallback: false,
  }
}
