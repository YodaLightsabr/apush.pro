import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";


import { Button, Card, Page, Tabs, Text } from '@geist-ui/core'
import Link from "next/link";
import { useSync } from "@/lib/sync";
import useMedia from "@/lib/media";



export default function Home() {
  const { unit, setUnit, displayUnit } = useSync();
  const { xs, sm, md, lg, xl } = useMedia();
  return (
    <>
      <Head>
        <title>APUSH.pro</title>
        <meta name="description" content="Study APUSH & get a 5 on Friday" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
          <Text h1 mb={0} mt={0}>APUSH<em>.pro</em></Text>
          <Text h3 mt={0} mb={3} style={{
            color: "#555",
          }}>AP US History Study Guide</Text>

          <Tabs initialValue="all" style={{
            width: "min-content",
            margin: "0 auto",
            maxWidth: "calc(100% - 12px)",
          }} onChange={setUnit} value={unit}>
            <Tabs.Item label="All Units" value="all" />
            <Tabs.Item label="Units 1 & 2" value="1/2" />
            <Tabs.Item label="Unit 3" value="3" />
            <Tabs.Item label="Unit 4" value="4" />
            <Tabs.Item label="Unit 5" value="5" />
            <Tabs.Item label="Unit 6" value="6" />
            <Tabs.Item label="Unit 7" value="7" />
            <Tabs.Item label="Unit 8" value="8" />
            <Tabs.Item label="Unit 9" value="9" />
          </Tabs>

          <Text h2 mt={4}>Select an Activity</Text>
          
          <div style={{
            display: "flex",
            flexDirection: md ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
          }}>
            <Card style={{
              textAlign: "center",
              minWidth: "400px",
            }} padding={1}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}>
              <Text h3 mt={0} mb={1}>{displayUnit} Topic Practice</Text>
                <Link href="/all-key-terms"><Button type="secondary-light" auto>All Key Terms</Button></Link>
                <Link href="#"><Button disabled type="secondary-light" auto>Key Events</Button></Link>
                <Link href="#"><Button disabled type="secondary-light" auto>Key People</Button></Link>
              </div>
            </Card>

            <Card style={{
              textAlign: "center",
              minWidth: "400px",
            }} padding={1}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}>
              <Text h3 mt={0} mb={1}>{displayUnit} LEQ Practice</Text>
                <Link href="#"><Button disabled type="secondary-light" auto>Full-Length LEQ</Button></Link>
                <Link href="#"><Button disabled type="secondary-light" auto>Background Info & Thesis</Button></Link>
                <Link href="#"><Button disabled type="secondary-light" auto>Evidence & Analysis</Button></Link>
              </div>
            </Card>
          </div>
      </div>
    </>
  );
}
