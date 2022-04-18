import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import Button from '@components/Button'
import Container from '@components/Container'
import Layout from '@components/Layout'
import styles from '@styles/Page.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Home({ home, products }) {
  console.log('🚀 ~ products', products)

  const { heroTitle, heroText, heroLink, heroBackground } = home

  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <Image
                className={styles.heroImage}
                src={heroBackground.url}
                width={heroBackground.width}
                height={heroBackground.height}
                alt="Hero image"
              />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map((product) => {
            return (
              <li key={product.slug}>
                <Link href="#">
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        width={product.image.width}
                        height={product.image.height}
                        src={product.image.url}
                        alt={product.name}
                      />
                    </div>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </a>
                </Link>
                <p>
                  <Button>Add to Cart</Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.graphcms.com/v2/cl23yxl535uf001xu9j0z7eyh/master',
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: gql`
      query PageHome {
        page(where: { slug: "home" }) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground {
            height
            width
            url
          }
        }
        products(first: 4) {
          name
          price
          slug
          image {
            height
            width
            url
          }
        }
      }
    `,
  })

  const home = data.page
  const products = data.products

  return {
    props: {
      home,
      products,
    },
  }
}
