import React from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SortIcon from "@mui/icons-material/Sort";
import FilterIcon from "@mui/icons-material/Filter";
import { Product } from "../../system/classes/product";
import { getLocalization, meta, saveLocalization } from "../../system/IO/io";
import ProductType from "../../system/classes/productType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateProductLine(
    product: Product,
    setOperating: React.Dispatch<React.SetStateAction<boolean>>
): JSX.Element {
  async function deleteProduct(): Promise<void> {
    setOperating(true);
    await product.set({ deleted: true });
    setOperating(false);
  }

  return (
      <TableRow key={ `product_row_${ product.id }` }>
        <TableCell>
          { product.id }
        </TableCell>
        <TableCell>
          { getLocalization(product.toInternalName()) }
        </TableCell>
        <TableCell>
          { getLocalization(product.type.toInternalName()) }
        </TableCell>
        <TableCell>
          { product.stock }
        </TableCell>
        <TableCell>
          <Button variant="contained" color="warning"
                  onClick={ deleteProduct }>
            删除
          </Button>
        </TableCell>
      </TableRow>
  );
}

function generateProductTableBody(
    setOperating: React.Dispatch<React.SetStateAction<boolean>>,
    activeProductTypeFilters: ProductType[],
    activeProductSort: string
): JSX.Element[] {
  let products = Product.loaded.filter(product => {
    return !product.deleted;
  });

  if (activeProductTypeFilters.length > 0) {
    products = products.filter(product => {
      return activeProductTypeFilters.includes(product.type);
    });
  }

  if (activeProductSort === "type") {
    products = products.sort((a, b) => {
      return a.type.id - b.type.id;
    });
  }

  if (activeProductSort === "stock") {
    products = products.sort((a, b) => {
      return b.stock - a.stock;
    });
  }

  return products.map(product => generateProductLine(product, setOperating));
}


function AddProductTypeButton({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ internalNameField, setInternalNameField ] = React.useState("");
  const [ displayNameField, setDisplayNameField ] = React.useState("");

  function closeDialog(): void {
    setInternalNameField("");
    setDisplayNameField("");
  }

  async function submit(): Promise<void> {
    setOperating(true);
    await ProductType.generate(internalNameField);
    await saveLocalization(internalNameField, displayNameField);
    setDialogOn(false);
    setOperating(false);
  }

  return (
      <>
        <Button
            variant="contained"
            color="primary"
            onClick={ () => {
              setDialogOn(true);
              setInternalNameField("");
              setDisplayNameField("");
            } }
        >
          新增商品类型
        </Button>

        <Dialog
            open={ dialogOn }
            onClose={ closeDialog }
            maxWidth="lg"
            PaperProps={ {
              style: {
                width: "80%",
                height: "80%"
              }
            } }
        >
          <DialogTitle>
            新增商品类型
            <IconButton
                aria-label="close"
                onClick={ () => setDialogOn(false) }
                style={ {
                  position: "absolute",
                  right: "8px",
                  top: "8px"
                } }
            >
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="序号"
                  value={ meta.lastProductTypeId }
                  fullWidth
                  InputProps={ {
                    readOnly: true
                  } }
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="内部名称"
                  value={ internalNameField }
                  onChange={ event => {
                    const value = event.target.value;
                    if (/^[a-zA-Z0-9_]+$/.test(value)) {
                      setInternalNameField(value);
                    } else {
                      setInternalNameField("");
                    }
                  } }
                  fullWidth
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="显示名称"
                  value={ displayNameField }
                  onChange={ event => setDisplayNameField(event.target.value) }
                  fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
                onClick={ () => setDialogOn(false) }
            >
              取消
            </Button>
            <Button
                onClick={ submit }
                variant="contained"
                color="primary"
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
}

function AddProductButton({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ internalNameField, setInternalNameField ] = React.useState("");
  const [ displayNameField, setDisplayNameField ] = React.useState("");
  const [ productTypeField, setProductTypeField ] = React.useState(0);

  function closeDialog(): void {
    setInternalNameField("");
    setDisplayNameField("");
  }

  async function submit(): Promise<void> {
    setOperating(true);
    await Product.generate(
        internalNameField,
        ProductType.fromNumber(productTypeField).unwrap()
    );
    await saveLocalization(internalNameField, displayNameField);
    setDialogOn(false);
    setOperating(false);
  }

  function getProductMenuItems(): JSX.Element[] {
    return ProductType.loaded.map(productType => (
        <MenuItem key={ productType.id } value={ productType.id }>
          { getLocalization(productType.toInternalName()) }
        </MenuItem>
    ));
  }

  return (
      <>
        <Button
            variant="contained"
            color="primary"
            onClick={ () => {
              setDialogOn(true);
              setInternalNameField("");
              setDisplayNameField("");
            } }
        >
          新增商品
        </Button>

        <Dialog
            open={ dialogOn }
            onClose={ closeDialog }
            maxWidth="lg"
            PaperProps={ {
              style: {
                width: "80%",
                height: "80%"
              }
            } }
        >
          <DialogTitle>
            新增商品
            <IconButton
                aria-label="close"
                onClick={ () => setDialogOn(false) }
                style={ {
                  position: "absolute",
                  right: "8px",
                  top: "8px"
                } }
            >
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="序号"
                  value={ meta.lastProductId }
                  fullWidth
                  InputProps={ {
                    readOnly: true
                  } }
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="内部名称"
                  value={ internalNameField }
                  onChange={ event => {
                    const value = event.target.value;
                    if (/^[a-zA-Z0-9_]+$/.test(value)) {
                      setInternalNameField(value);
                    } else {
                      setInternalNameField("");
                    }
                  } }
                  fullWidth
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="显示名称"
                  value={ displayNameField }
                  onChange={ event => setDisplayNameField(event.target.value) }
                  fullWidth
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <FormControl fullWidth>
                <InputLabel id="product-type-select-label">
                  商品类型
                </InputLabel>
                <Select
                    labelId="product-type-select-label"
                    value={ productTypeField }
                    onChange={ event => setProductTypeField(event.target.value as number) }
                >
                  { getProductMenuItems() }
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
                onClick={ () => setDialogOn(false) }
            >
              取消
            </Button>
            <Button
                onClick={ submit }
                variant="contained"
                color="primary"
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
}

function FilterProductTypeButton(
    { activeProductTypeFilters, setActiveProductTypeFilters }: {
      activeProductTypeFilters: ProductType[],
      setActiveProductTypeFilters: React.Dispatch<React.SetStateAction<ProductType[]>>
    }
): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilters, setNewFilters ] = React.useState<ProductType[]>([]);

  function submit(): void {
    setActiveProductTypeFilters(newFilters);
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilters(activeProductTypeFilters.slice(0));
            } }
            color={
              activeProductTypeFilters.length > 0 ?
                  "primary" :
                  "default"
            }
        >
          <FilterIcon/>
        </IconButton>

        <Dialog
            open={ dialogOn }
            maxWidth="lg"
            PaperProps={ {
              style: {
                width: "50%",
                height: "50%"
              }
            } }
        >
          <DialogTitle>
            筛选商品类型
            <IconButton
                aria-label="close"
                onClick={ () => setDialogOn(false) }
                style={ {
                  position: "absolute",
                  right: "8px",
                  top: "8px"
                } }
            >
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            { ProductType.loaded.map(productType => (
                <FormControlLabel
                    key={ `filter-product-type-box-${ productType.id }` }
                    control={
                      <Checkbox
                          checked={ newFilters.includes(productType) }
                          onChange={ event => {
                            if (event.target.checked) {
                              setNewFilters(newFilters.concat(productType));
                            } else {
                              setNewFilters(newFilters.filter(
                                  filter => filter !== productType
                              ));
                            }
                          } }
                          color="primary"
                      />
                    }
                    label={ getLocalization(productType.toInternalName()) }
                />
            )) }
          </DialogContent>
          <DialogActions>
            <Button
                onClick={ () => setDialogOn(false) }
            >
              取消
            </Button>
            <Button
                onClick={ submit }
                variant="contained"
                color="primary"
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
}

export function ProductView({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ activeProductTypeFilters, setActiveProductTypeFilters ] =
      React.useState<ProductType[]>([]);
  const [ activeProductSort, setActiveProductSort ] =
      React.useState<string>("");

  return (
      <Container sx={ { width: "100%" } }>
        <Box display="flex" gap={ 2 } mt={ 2 } mb={ 2 }>
          <AddProductTypeButton setOperating={ setOperating }/>
          <AddProductButton setOperating={ setOperating }/>
        </Box>
        <TableContainer component={ Paper }>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  商品编号
                </TableCell>
                <TableCell>
                  商品名称
                </TableCell>
                <TableCell>
                  商品类型
                  <FilterProductTypeButton
                      activeProductTypeFilters={ activeProductTypeFilters }
                      setActiveProductTypeFilters={ setActiveProductTypeFilters }
                  />
                  <IconButton
                      onClick={ () => {
                        setActiveProductSort(
                            activeProductSort === "type" ? "" : "type"
                        );
                      } }
                      color={
                        activeProductSort === "type" ?
                            "primary" :
                            "default"
                      }
                  >
                    <SortIcon/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  商品库存
                  <IconButton
                      onClick={ () => {
                        setActiveProductSort(
                            activeProductSort === "stock" ? "" : "stock"
                        );
                      } }
                      color={
                        activeProductSort === "stock" ?
                            "primary" :
                            "default"
                      }
                  >
                    <SortIcon/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { generateProductTableBody(
                  setOperating,
                  activeProductTypeFilters,
                  activeProductSort
              ) }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
}