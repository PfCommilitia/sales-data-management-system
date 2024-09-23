import React from "react";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Modifier } from "../../system/classes/modifier";
import { getLocalization, meta, saveLocalization } from "../../system/IO/io";
import { ModifierType } from "../../system/classes/modifierType";
import Operator from "../../system/classes/operator";
import CloseIcon from "@mui/icons-material/Close";
import FilterIcon from "@mui/icons-material/Filter";
import Product from "../../system/classes/product";
import ProductType from "../../system/classes/productType";

function generateModifierLine(modifier: Modifier): JSX.Element {
  const localizedModifierType = [
    "售出",
    "进货"
  ];

  return (
      <TableRow key={ `modifier_row_${ modifier.id }` }>
        <TableCell>
          { modifier.id }
        </TableCell>
        <TableCell>
          { modifier.timeStamp.toLocaleString() }
        </TableCell>
        <TableCell>
          { modifier.product.toNumber() }
        </TableCell>
        <TableCell>
          { getLocalization(modifier.product.toInternalName()) }
        </TableCell>
        <TableCell>
          { getLocalization(modifier.product.type.toInternalName()) }
        </TableCell>
        <TableCell>
          { getLocalization(modifier.operator.toInternalName()) }
        </TableCell>
        <TableCell>
          {
            localizedModifierType[ModifierType.toNumber(modifier.type)]
          }
        </TableCell>
        <TableCell>
          { modifier.amount }
        </TableCell>
      </TableRow>
  );
}

function filterModifiers(
    modifiers: Modifier[],
    filterTimeStamp: (Date | null)[],
    filterProducts: Product[],
    filterProductTypes: ProductType[],
    filterOperators: Operator[],
    filterModifierType: number
): Modifier[] {
  return modifiers.filter(
      modifier => (
              filterTimeStamp.length === 0 ||
              (
                  filterTimeStamp[0] ===
                  null ||
                  modifier.timeStamp >=
                  filterTimeStamp[0]
              ) &&
              (
                  filterTimeStamp[1] ===
                  null ||
                  modifier.timeStamp <=
                  filterTimeStamp[1]
              )
          ) &&
          (
              filterProducts.length === 0 ||
              filterProducts.includes(modifier.product)
          ) &&
          (
              filterProductTypes.length === 0 ||
              filterProductTypes.includes(modifier.product.type)
          ) &&
          (
              filterOperators.length === 0 ||
              filterOperators.includes(modifier.operator)
          ) &&
          (
              filterModifierType < 0 ||
              ModifierType.toNumber(modifier.type) === filterModifierType
          )
  );
}

function generateModifierTableBody(
    filterTimeStamp: (Date | null)[],
    filterProducts: Product[],
    filterProductTypes: ProductType[],
    filterOperators: Operator[],
    filterModifierType: number
): JSX.Element[] {
  return filterModifiers(
      Modifier.loaded,
      filterTimeStamp,
      filterProducts,
      filterProductTypes,
      filterOperators,
      filterModifierType
  ).map(modifier => generateModifierLine(modifier));
}

function getFilteredTotalSales(
    filterTimeStamp: (Date | null)[],
    filterProducts: Product[],
    filterProductTypes: ProductType[],
    filterOperators: Operator[],
    filterModifierType: number
): number {
  if (filterModifierType !== -1 && filterModifierType !== ModifierType.SALE) {
    return 0;
  }

  return filterModifiers(
      Modifier.loaded,
      filterTimeStamp,
      filterProducts,
      filterProductTypes,
      filterOperators,
      filterModifierType
  ).reduce(
      (acc, modifier) => {
        if (ModifierType.toNumber(modifier.type) === ModifierType.SALE) {
          return acc + modifier.amount;
        } else {
          return acc;
        }
      },
      0
  );
}

function AddOperatorButton({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ internalName, setInternalName ] = React.useState("");
  const [ displayName, setDisplayName ] = React.useState("");

  function closeDialog(): void {
    setInternalName("");
    setDisplayName("");
  }

  async function submit(): Promise<void> {
    setOperating(true);
    await Operator.generate(internalName);
    await saveLocalization(internalName, displayName);
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
              setInternalName("");
              setDisplayName("");
            } }
        >
          新增操作员
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
            新增操作员
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
                  value={ meta.lastOperatorId }
                  fullWidth
                  InputProps={ {
                    readOnly: true
                  } }
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="内部名称"
                  value={ internalName }
                  onChange={ event => {
                    const value = event.target.value;
                    if (/^[a-zA-Z0-9_]+$/.test(value)) {
                      setInternalName(value);
                    } else {
                      setInternalName("");
                    }
                  } }
                  fullWidth
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="显示名称"
                  value={ displayName }
                  onChange={ event => setDisplayName(event.target.value) }
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
            </Button> </DialogActions>
        </Dialog>
      </>
  );
}

function AddModifierButton({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ typeField, setTypeField ] = React.useState(0);
  const [ productField, setProductField ] = React.useState(0);
  const [ operatorField, setOperatorField ] = React.useState(0);
  const [ timeStampField, setTimeStampField ] =
      React.useState<Date | null>(new Date());
  const [ amountField, setAmountField ] = React.useState(0);

  function closeDialog(): void {
    setTypeField(0);
    setProductField(0);
    setOperatorField(0);
    setTimeStampField(new Date());
    setAmountField(0);
  }

  async function submit(): Promise<void> {
    setOperating(true);
    await Modifier.generate(
        ModifierType.fromNumber(typeField).unwrap(),
        Product.fromNumber(productField).unwrap(),
        Operator.fromNumber(operatorField).unwrap(),
        timeStampField ?? new Date(),
        amountField
    );
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
              setTypeField(0);
              setProductField(0);
              setOperatorField(0);
              setTimeStampField(new Date());
              setAmountField(0);
            } }
        >
          新增操作记录
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
            新增操作记录
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
                  value={ meta.lastModifierId }
                  fullWidth
                  InputProps={ {
                    readOnly: true
                  } }
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <FormControl fullWidth>
                <InputLabel id="modifier-type-select-label">
                  操作类型
                </InputLabel>
                <Select
                    labelId="modifier-type-select-label"
                    value={ typeField }
                    onChange={ event => setTypeField(event.target.value as number) }
                >
                  <MenuItem key={ 0 } value={ 0 }>
                    售出
                  </MenuItem>
                  <MenuItem key={ 1 } value={ 1 }>
                    进货
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <FormControl fullWidth>
                <InputLabel id="modifier-product-select-label">
                  商品
                </InputLabel>
                <Select
                    labelId="modifier-product-select-label"
                    value={ productField }
                    onChange={ event => setProductField(event.target.value as number) }
                >
                  { Product.loaded.map(product => (
                      <MenuItem key={ product.id } value={ product.id }>
                        { getLocalization(product.toInternalName()) }
                      </MenuItem>
                  )) }
                </Select>
              </FormControl>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="商品序号"
                  value={ productField }
                  fullWidth
                  InputProps={ {
                    readOnly: true
                  } }
              />
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <FormControl fullWidth>
                <InputLabel id="modifier-operator-select-label">
                  操作员
                </InputLabel>
                <Select
                    labelId="modifier-operator-select-label"
                    value={ operatorField }
                    onChange={ event => setOperatorField(event.target.value as number) }
                >
                  { Operator.loaded.map(operator => (
                      <MenuItem key={ operator.id } value={ operator.id }>
                        { getLocalization(operator.toInternalName()) }
                      </MenuItem>
                  )) }
                </Select>
              </FormControl>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <LocalizationProvider dateAdapter={ AdapterDateFns }>
                <DateTimePicker
                    sx={ { width: "100%" } }
                    label="时间戳"
                    value={ timeStampField }
                    onChange={ setTimeStampField }
                />
              </LocalizationProvider>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <TextField
                  label="数量"
                  value={ amountField }
                  onChange={ event => {
                    if (parseInt(event.target.value) >= 0) {
                      setAmountField(parseInt(event.target.value));
                    } else {
                      setAmountField(0);
                    }
                  } }
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

function FilterTimeStampButton({ filterTimeStamp, setFilterTimeStamp }: {
  filterTimeStamp: (Date | null)[],
  setFilterTimeStamp: React.Dispatch<React.SetStateAction<(Date | null)[]>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilter1, setNewFilter1 ] = React.useState<Date | null>(new Date());
  const [ newFilter2, setNewFilter2 ] = React.useState<Date | null>(new Date());

  function submit(): void {
    if (newFilter1 === null || newFilter2 === null) {
      setFilterTimeStamp([]);
    } else {
      setFilterTimeStamp([ newFilter1, newFilter2 ]);
    }
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilter1(filterTimeStamp[0] ?? null);
              setNewFilter2(filterTimeStamp[1] ?? null);
            } }
            color={ filterTimeStamp.length > 0 ? "primary" : "default" }
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
            筛选时间戳
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
              <LocalizationProvider dateAdapter={ AdapterDateFns }>
                <DateTimePicker
                    sx={ { width: "100%" } }
                    label="开始时间"
                    value={ newFilter1 }
                    onChange={ setNewFilter1 }
                />
              </LocalizationProvider>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <LocalizationProvider dateAdapter={ AdapterDateFns }>
                <DateTimePicker
                    sx={ { width: "100%" } }
                    label="结束时间"
                    value={ newFilter2 }
                    onChange={ setNewFilter2 }
                />
              </LocalizationProvider>
            </Box>

            <Box mt={ 2 } mb={ 2 }>
              <Button
                  onClick={ () => {
                    setNewFilter1(null);
                    setNewFilter2(null);
                  } }
                  color="primary"
              >
                清除筛选
              </Button>
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

function FilterProductsButton({ filterProducts, setFilterProducts }: {
  filterProducts: Product[],
  setFilterProducts: React.Dispatch<React.SetStateAction<Product[]>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilter, setNewFilter ] = React.useState<Product[]>([]);

  function submit(): void {
    setFilterProducts(newFilter);
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilter(filterProducts.slice(0));
            } }
            color={ filterProducts.length > 0 ? "primary" : "default" }
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
            筛选商品
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
            { Product.loaded.map(product => (
                <FormControlLabel
                    key={ `filter-product-box-${ product.id }` }
                    control={
                      <Checkbox
                          checked={ newFilter.includes(product) }
                          onChange={ event => {
                            if (event.target.checked) {
                              setNewFilter(newFilter.concat(product));
                            } else {
                              setNewFilter(newFilter.filter(
                                  filter => filter !== product
                              ));
                            }
                          } }
                          color="primary"
                      />
                    }
                    label={ getLocalization(product.toInternalName()) }
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

function FilterProductTypesButton({
  filterProductTypes,
  setFilterProductTypes
}: {
  filterProductTypes: ProductType[],
  setFilterProductTypes: React.Dispatch<React.SetStateAction<ProductType[]>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilter, setNewFilter ] = React.useState<ProductType[]>([]);

  function submit(): void {
    setFilterProductTypes(newFilter);
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilter(filterProductTypes.slice(0));
            } }
            color={ filterProductTypes.length > 0 ? "primary" : "default" }
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
                    key={ `filter-product-type-alternate-box-${ productType.id }` }
                    control={
                      <Checkbox
                          checked={ newFilter.includes(productType) }
                          onChange={ event => {
                            if (event.target.checked) {
                              setNewFilter(newFilter.concat(productType));
                            } else {
                              setNewFilter(newFilter.filter(
                                  filter => filter !== productType
                              ));
                            }
                          } }
                          color="primary"
                      />
                    }
                    label={ getLocalization(productType.internalName) }
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

function FilterOperatorsButton({ filterOperators, setFilterOperators }: {
  filterOperators: Operator[],
  setFilterOperators: React.Dispatch<React.SetStateAction<Operator[]>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilter, setNewFilter ] = React.useState<Operator[]>([]);

  function submit(): void {
    setFilterOperators(newFilter);
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilter(filterOperators.slice(0));
            } }
            color={ filterOperators.length > 0 ? "primary" : "default" }
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
            筛选操作员
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
            { Operator.loaded.map(operator => (
                <FormControlLabel
                    key={ `filter-operator-box-${ operator.id }` }
                    control={
                      <Checkbox
                          checked={ newFilter.includes(operator) }
                          onChange={ event => {
                            if (event.target.checked) {
                              setNewFilter(newFilter.concat(operator));
                            } else {
                              setNewFilter(newFilter.filter(
                                  filter => filter !== operator
                              ));
                            }
                          } }
                          color="primary"
                      />
                    }
                    label={ getLocalization(operator.toInternalName()) }
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

function FilterModifierTypeButton({
  filterModifierType,
  setFilterModifierType
}: {
  filterModifierType: number,
  setFilterModifierType: React.Dispatch<React.SetStateAction<number>>
}): JSX.Element {
  const [ dialogOn, setDialogOn ] = React.useState(false);
  const [ newFilter, setNewFilter ] = React.useState<number>(-1);

  function submit(): void {
    setFilterModifierType(newFilter);
    setDialogOn(false);
  }

  return (
      <>
        <IconButton
            onClick={ () => {
              setDialogOn(true);
              setNewFilter(filterModifierType);
            } }
            color={ filterModifierType >= 0 ? "primary" : "default" }
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
            筛选操作类型
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
              <FormControl fullWidth>
                <InputLabel id="modifier-type-select-label">
                  操作类型
                </InputLabel>
                <Select
                    labelId="modifier-type-select-label"
                    value={ newFilter }
                    onChange={ event => setNewFilter(event.target.value as number) }
                >
                  <MenuItem key={ -1 } value={ -1 }>
                    不筛选
                  </MenuItem>
                  <MenuItem key={ 0 } value={ 0 }>
                    售出
                  </MenuItem>
                  <MenuItem key={ 1 } value={ 1 }>
                    进货
                  </MenuItem>
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


export function StockView({ setOperating }: {
  setOperating: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const [ filterTimeStamp, setFilterTimeStamp ] = React.useState<(Date | null)[]>(
      []);
  const [ filterProducts, setFilterProducts ] = React.useState<Product[]>([]);
  const [ filterProductTypes, setFilterProductTypes ] = React.useState<ProductType[]>(
      []);
  const [ filterOperators, setFilterOperators ] = React.useState<Operator[]>([]);
  const [ filterModifierType, setFilterModifierType ] = React.useState<number>(-1);

  return (
      <Container sx={ { width: "100%" } }>
        <Box display="flex" mb={ 2 } justifyContent="space-between">
          <Box display="flex" gap={ 2 }>
            <AddOperatorButton setOperating={ setOperating }/>
            <AddModifierButton setOperating={ setOperating }/>
          </Box>

          <Typography>
            总销量：
            <Typography component="span" color="primary">
              { getFilteredTotalSales(
                  filterTimeStamp,
                  filterProducts,
                  filterProductTypes,
                  filterOperators,
                  filterModifierType
              ) }
            </Typography>
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  记录编号
                </TableCell>
                <TableCell>
                  时间戳
                  <FilterTimeStampButton
                      filterTimeStamp={ filterTimeStamp }
                      setFilterTimeStamp={ setFilterTimeStamp }
                  />
                </TableCell>
                <TableCell>
                  商品编号
                </TableCell>
                <TableCell>
                  商品名称
                  <FilterProductsButton
                      filterProducts={ filterProducts }
                      setFilterProducts={ setFilterProducts }
                  />
                </TableCell>
                <TableCell>
                  商品类型
                  <FilterProductTypesButton
                      filterProductTypes={ filterProductTypes }
                      setFilterProductTypes={ setFilterProductTypes }
                  />
                </TableCell>
                <TableCell>
                  操作员
                  <FilterOperatorsButton
                      filterOperators={ filterOperators }
                      setFilterOperators={ setFilterOperators }
                  />
                </TableCell>
                <TableCell>
                  操作类型
                  <FilterModifierTypeButton
                      filterModifierType={ filterModifierType }
                      setFilterModifierType={ setFilterModifierType }
                  />
                </TableCell>
                <TableCell>
                  操作数量
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { generateModifierTableBody(
                  filterTimeStamp,
                  filterProducts,
                  filterProductTypes,
                  filterOperators,
                  filterModifierType
              ) }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
}