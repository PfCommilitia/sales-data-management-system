import {
  Box,
  CssBaseline,
  ThemeProvider,
  Button,
  Container,
  Typography
} from "@mui/material";
import React from "react";
import theme from "../theme";
import TabPages from "./panel";
import { setBasePath, initPath } from "../../system/IO/io";
import { ipcRenderer } from "electron";

function OperatingOverlay(): JSX.Element {
  return (
      <Container
          maxWidth="xl"
          sx={ {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          } }
      >
        <Typography variant="h1" component="h1" gutterBottom>
          请等待系统处理……
        </Typography>
      </Container>
  );
}

function SelectFolderPage({ callback }: {
  callback: (_basePath: string) => Promise<void>
}): JSX.Element {
  async function selectFolder(): Promise<void> {
    const path = await ipcRenderer.invoke("select-directory") as undefined | string;
    if (path) {
      await callback(path);
    }
  }

  return (
      <Container
          maxWidth="xl"
          sx={ {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            textAlign: "center"
          } }
      >
        <Typography variant="h1" component="h1" gutterBottom>
          欢迎使用销售数据管理系统
        </Typography>
        <Typography variant="body1" color="primary" gutterBottom>
          请选择数据存储目录，或者创建一个新的数据存储目录。
        </Typography>
        <Box mt={ 2 }>
          <Button variant="contained" color="primary" onClick={ selectFolder }>
            浏览……
          </Button>
        </Box>
      </Container>
  );
}

export default function App(): JSX.Element {
  const [ operating, setOperating ] = React.useState(false);
  const [ initialized, setInitialized ] = React.useState(false);

  async function initApp(basePath: string): Promise<void> {
    setOperating(true);
    setBasePath(basePath);
    await initPath();
    setOperating(false);
    setInitialized(true);
  }

  return (
      // Setup theme and css baseline for the Material-UI app
      // https://mui.com/customization/theming/
      <ThemeProvider theme={ theme }>
        <CssBaseline/>
        <Box
            sx={ {
              backgroundColor: (theme) => theme.palette.background.default
            } }
        >
          <main>
            { operating && <OperatingOverlay/> }
            { !initialized ? (
                <SelectFolderPage callback={ initApp }/>
            ) : (
                <TabPages setOperating={ setOperating }/>
            ) }
          </main>
        </Box>
      </ThemeProvider>
  );
}
