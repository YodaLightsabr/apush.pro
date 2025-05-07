import useMedia from "@/lib/media";
import { SyncProvider, useSync } from "@/lib/sync";
import "@/styles/globals.css";
import { GeistProvider, CssBaseline, Text, Page, Button, Drawer } from '@geist-ui/core'
import { ChevronUpDown, Circle, Settings } from "@geist-ui/icons";
import Link from "next/link";
import { useState } from "react";

function StudyListButton() {
  const [state, setState] = useState(false);
  return (
    <>
      <Button onClick={() => setState(true)} icon={<ChevronUpDown />} auto>Study List</Button>
      <Drawer visible={state} onClose={() => setState(false)} placement="right">
        <Drawer.Title>Study List</Drawer.Title>
        <Drawer.Subtitle>0 items</Drawer.Subtitle>
        <Drawer.Content>
          <p>Get started by adding items to your study list</p>
        </Drawer.Content>
      </Drawer>

    </>
  );
}

function Unit () {
  const { displayUnit } = useSync();
  const { sm } = useMedia();

  return (
    <Text h4 margin={0} style={{
      display: sm ? "block" : "none",
    }}>{displayUnit || "All Units"}</Text>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <GeistProvider>
      <SyncProvider>
        <CssBaseline /> {/* --> base styles */}

        <div style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: "0px",
          left: "0px",
          width: "100%",
          zIndex: "100",
          boxSizing: "border-box",
          gap: "1.5rem",

        }}>
          <Link href="/" style={{
            color: "inherit",
          }}>
            <Text h3 margin={0}>APUSH<em>.pro</em></Text>
          </Link>

          <div style={{ flexGrow: 1 }}></div>

          <Unit />

          <StudyListButton />

        </div>

        <Page style={{
          textAlign: "center",
          height: "calc(100vh - 73px)!important",
          overflowY: "auto",
          minHeight: "0px",
          marginLeft: "0px",
          marginRight: "0px",
          width: "100%",
        }}>
          <Component {...pageProps} /> {/* --> your application */}
        </Page>
      </SyncProvider>
    </GeistProvider>
  );
}
