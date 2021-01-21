import Head from 'next/head';
import styles from '../styles/Home.module.css';
// Here, we use the Apollo Client, which will allow us to interface with the SpaceX GraphQL server. We make our request to the API using the Next.js getStaticProps method, allowing us to dynamically create props for our page when it builds.
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
// InMemoryCache which allows Apollo to optimize by reading from cache, and gql which we use to form our GraphQL query.

export default function Home({ launches }) {
  console.log('launches', launches);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>

        <p className={styles.description}>The 10 latest SpaceX launches...</p>

        <div className={styles.grid}>
          {launches.map((launch) => {
            return (
              <a
                key={launch.id}
                href={launch.links.video_link}
                className={styles.card}
              >
                <h3>{launch.mission_name}</h3>
                <p>
                  <strong>Launch Date:</strong>{' '}
                  {new Date(launch.launch_date_local).toLocaleDateString(
                    'en-US'
                  )}
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

// When Next.js builds our app, it knows to look for this function. So when we export it, we’re letting Next.js know we want to run code in that function.
export async function getStaticProps() {
  // to use the Apollo Client, we need to set up a new instance of it.
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache(),
  });
  // This creates a new Apollo Client instance using the SpaceX API endpoint that we’ll use to query against.

  // Now we are able to build the query:
  // This query requires the last 10 launches of SpaceX.
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
  });
  // 1. Creates a new GraphQL query inside of the gql tag
  // 2. Creates a new query request using client.query
  // 3. It uses await to make sure it finishes the request before continuing
  // 4. Destructures data from the results, which is where the information we need is stored

  return {
    props: {
      launches: data.launchesPast, // returns the empty lauches object
    },
  };
}
