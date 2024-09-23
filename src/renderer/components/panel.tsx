import React from "react";
import { Box, Tab, Tabs, Typography, Container } from "@mui/material";
import { ProductView } from "./productPage";
import { StockView } from "./stockPage";

function TabPanel(props: any): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
      <Container
          role="tabpanel"
          hidden={ value !== index }
          id={ `page-tab-${ index }` }
          aria-labelledby={ `page-tab-button-${ index }` }
          { ...other }
      >
        { value === index && (
            <Box sx={ { p: 3 } }>
              <Typography>{ children }</Typography>
            </Box>
        ) }
      </Container>
  );
}

export function TabPages({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ page, setPage ] = React.useState(0);

  function switchPage(event: React.SyntheticEvent, newValue: number) {
    setPage(newValue);
  }

  return (
      <Container sx={ { width: "100%" } }>
        <Tabs
            value={ page }
            onChange={ switchPage }
            aria-label="page tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
        >
          <Tab label="商品目录" id="page-tab-button-0"
               aria-controls="page-tab-0"/>
          <Tab label="库存管理" id="page-tab-button-1"
               aria-controls="page-tab-1"/>
        </Tabs>

        <TabPanel value={ page } index={ 0 }>
          <ProductView setOperating={ setOperating }/>
        </TabPanel>
        <TabPanel value={ page } index={ 1 }>
          <StockView setOperating={ setOperating }/>
        </TabPanel>
      </Container>
  );
}

export default TabPages;