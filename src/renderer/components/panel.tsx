import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

function TabPanel(props: any): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
      <div
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
      </div>
  );
}

export function TabPages(): JSX.Element {
  const [ page, setPage ] = React.useState(0);

  function switchPage(event: React.SyntheticEvent, newValue: number) {
    setPage(newValue);
  }

  return (
      <Box sx={ { width: "100%" } }>
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

        <TabPanel value={page} index={0}>
          商品目录占位符
        </TabPanel>
        <TabPanel value={page} index={1}>
          库存管理占位符
        </TabPanel>
      </Box>
  );
}

export default TabPages;