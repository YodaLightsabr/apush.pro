import Head from "next/head";
import { keyPeopleQuestions } from "@/lib/questionLibrary";
import Practice from "@/components/Practice";

export default function AllKeyPeople() {
  return (
    <>
      <Head>
        <title>APUSH.pro Key People Practice</title>
        <meta name="description" content="Study APUSH & get a 5 on Friday" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Practice name="Key People Practice" questionBank={keyPeopleQuestions} />
    </>
  )
}