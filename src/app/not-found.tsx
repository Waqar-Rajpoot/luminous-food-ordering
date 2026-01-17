import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-card-background text-white p-4">
        <h1 className="text-8xl md:text-9xl font-bold text-[#EFA765]">
          404
        </h1>
        <p className="text-xl md:text-2xl mt-4 text-gray-300">
          Oops! The page you are looking for could not be found.
        </p>
        <Link 
          href="/" 
          className="mt-8 px-6 py-3 rounded-full text-white font-semibold text-lg bg-[#EFA765] hover:bg-[#d89656] transition-colors shadow-lg"
        >
          Go to Home
        </Link>
      </div>
    </>
  );
}
