import { gql } from '@apollo/client'
import Button from '@components/Button'
import Container from '@components/Container'
import Layout from '@components/Layout'
import styles from '@styles/Product.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import { apolloClient } from 'src/clients/apollo'

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
              src={product.image.url}
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

export async function getStaticProps({ params }) {
  const { data } = await apolloClient.query({
    query: gql`
      query PageProduct($slug: String) {
        product(where: { slug: $slug }) {
          id
          name
          price
          image
          slug
          description {
            html
          }
        }
      }
    `,
    variables: {
      slug: params.slug,
    },
  })

  const { product } = data

  return {
    props: { product },
  }
}

export async function getStaticPaths() {
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
    paths,
    fallback: false,
  }
}
