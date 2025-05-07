import Head from "next/head";
import { keyEventsQuestions } from "@/lib/questionLibrary";
import Practice from "@/components/Practice";

export default function AllKeyTerms() {
  return (
    <>
      <Head>
        <title>APUSH.pro Key Events Practice</title>
        <meta name="description" content="Study APUSH & get a 5 on Friday" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Practice name="Key Events Practice" questionBank={keyEventsQuestions} />
    </>
  )
}