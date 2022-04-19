import { gql } from '@apollo/client'
import Button from '@components/Button'
import Container from '@components/Container'
import Layout from '@components/Layout'
import styles from '@styles/Product.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import { apolloClient } from 'src/clients/apollo'
import { buildImage } from 'src/services/cloudinary'

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta
          name="description"
          content={`Find this ${product.name} at Space Jelly gear`}
        />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <Image
              width={product.image.width}
              height={product.image.height}
              src={buildImage(product.image.public_id)
                .resize('w_900,h_900')
                .toURL()}
              alt={product.name}
            />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div
              className={styles.productDescription}
              dangerouslySetInnerHTML={{ __html: product.description?.html }}
            />

            <p className={styles.productPrice}>${product.price}</p>
            <p className={styles.productBuy}>
              <Button
                className="snipcart-add-item"
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-url={`/products/${product.slug}`}
                data-item-image={product.image.url}
                data-item-name={product.name}
              >
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, locale }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageProduct($slug: String, $locale: Locale!) {
        product(where: { slug: $slug }) {
          id
          name
          price
          image
          slug
          description {
            html
          }
          localizations(locales: [$locale]) {
            description {
              html
            }
            locale
          }
        }
      }
    `,
    variables: {
      slug: params.slug,
      locale,
    },
  })

  let { product } = data

  if (product.localizations.length > 0) {
    product = {
      ...product,
      ...product.localizations[0],
    }
  }

  return {
    props: { product },
  }
}

export async function getStaticPaths({ locales }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageProducts {
        products {
          name
          price
          slug
          image
        }
      }
    `,
  })

  const paths = data.products.map((product) => {
    return {
      params: {
        slug: product.slug,
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
