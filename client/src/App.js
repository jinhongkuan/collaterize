import React, { useState, useEffect, Component } from "react";
import KeylinkContract from "./contracts/Keylink.json";
import ILiquidationCheck from "./contracts/ILiquidationCheck.json";
import CountLiquidationCheck from "./contracts/CountLiquidationCheck.json";

import IERC20 from "./contracts/IERC20.json";
import IERC20Metadata from "./contracts/IERC20Metadata.json";
import TestERC20 from "./contracts/ERC20.json";
import getWeb3 from "./getWeb3";
import { Express, Request, Deposit } from "./Express.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";

import Logo from "./resources/logo.png";
import LandingPageArt1 from "./resources/landing_page_1.png";
import LandingPageArt2 from "./resources/landing_page_2.jpg";
import LandingPageArt3 from "./resources/landing_page_3.jpg";
import LandingPageArt4a from "./resources/landing_page_4a.png";
import LandingPageArt4b from "./resources/landing_page_4b.png";
import ChainlinkLogo from "./resources/chainlink_logo.svg";
import ErrorLogo from "@material-ui/icons/Error";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import FormControl from "@material-ui/core/FormControl";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import FadeIn from "react-fade-in";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Key from "@material-ui/icons/VpnKey";
import HelpIcon from "@material-ui/icons/Help";
import EnhancedEncryptionIcon from "@material-ui/icons/EnhancedEncryption";
import SwapIcon from "@material-ui/icons/SwapHoriz";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import purple from "@material-ui/core/colors/purple";
import "./App.css";
import { IconButton } from "@material-ui/core";
import { readURL } from "./utils";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import VpnKey from "@material-ui/icons/VpnKey";
const secret = require("./secret.json");
const nftStorageClient = new NFTStorage({ token: secret.nftstorage_api });
const axios = require("axios");
const server_url = secret.server_url;
// const uint8ArrayConcat = require("uint8arrays/concat");
// const uint8ArrayToString = require("uint8arrays/to-string");

const mainTheme = createMuiTheme({
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },

  palette: {
    primary: {
      main: orange[400],
      contrastText: "#fff",
    },
    secondary: {
      main: blue[800],
      contrastText: "#fff",
    },
  },
});

const styles = (theme) => ({
  collateral_card: {
    width: 375,
    minWidth: 275,
    minHeight: 200,
    marginBottom: 25,
    position: "relative",
  },

  amount_display: {
    bottom: 25,
    left: 25,
    fontSize: 20,
    position: "absolute",
  },

  title_display: {
    top: 25,
    left: 25,
    fontSize: 18,
    position: "absolute",
  },

  unlock_button: {
    bottom: 21,
    padding: 4,
    right: 25,
    fontSize: 16,
    position: "absolute",
  },

  key_box: {
    top: 19,
    right: 25,
    position: "absolute",
  },

  key: {
    position: "relative",
  },

  send_address: {
    marginTop: 15,
    paddingTop: 15,
    width: "100%",
  },

  share_link: {
    marginTop: 0,
    padding: 0,
    width: "300px",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  amount_input: {},

  tool_bar: {
    justifyContent: "flex-end",
    display: "flex",
    width: "100%",
  },

  action_dialog: {
    justifyContent: "flex-end",
    display: "flex",
    width: "100%",
    height: "100%",
  },

  connect_wallet: {
    width: 150,
    height: 40,
    marginTop: 5,
    marginBottom: 5,
  },

  add_collateral_bar: {
    background: mainTheme.palette.secondary.main,
    paddingTop: 8,
    paddingBottom: 8,
  },

  create_request_bar: {
    background: mainTheme.palette.secondary.main,
    paddingTop: 8,
    paddingBottom: 8,
  },

  deposit_text_field: {
    width: "50vw",
  },
});

const WhiteTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const LandingPageTooltip = withStyles({
  tooltip: {
    color: "black",
    backgroundColor: "white",
    border: "1px  solid black",
    fontSize: 15,
  },
})(Tooltip);

const App = (props) => {
  const { classes } = props;
  const [page, setPage] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [constants, setConstants] = useState(null);
  const [account, setAccount] = useState(null);
  const [keylinkContract, setKeylinkContract] = useState(null);
  const [delegatorContract, setDelegatorContract] = useState(null);
  const [collateralList, setCollateralList] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [lcAddresses, setLCAddresses] = useState(null);

  const connectWeb3 = async () => {
    // Get network provider and web3 instance.
    let web3;
    try {
      web3 = await getWeb3();
    } catch (error) {
      return false;
    }

    // Use web3 to get the user's accounts.
    const account = (await web3.eth.getAccounts())[0];
    // Get the keylinkContract instance.

    const networkId = await web3.eth.net.getId();

    let constantsRequest = (await axios.get(`${server_url}/environment`)).data;

    if (!(networkId in constantsRequest.lcAddresses)) {
      setWrongNetwork(true);
      return;
    }
    const tokenList = constantsRequest.tokenAddresses[networkId];
    const nativeToken = constantsRequest.nativeTokens[networkId];
    const lc = constantsRequest.lcAddresses;

    setLCAddresses(lc);

    const _constants = {
      assets: {},
    };
    _constants["assets"][nativeToken.name] = {
      address: "NATIVE",
      decimals: nativeToken.decimals,
      balance: await web3.eth.getBalance(account),
      symbol: nativeToken.symbol,
      icon: nativeToken.icon,
    };

    for (let i = 0; i < tokenList.length; i++) {
      const addr = tokenList[i].address;
      const name = tokenList[i].name;
      const symbol = tokenList[i].symbol;
      const decimals = tokenList[i].decimals;
      const icon = tokenList[i].icon;
      let erc20contract = new web3.eth.Contract(IERC20.abi, addr);
      let balance = await erc20contract.methods.balanceOf(account).call();

      _constants.assets[name] = {
        address: addr,
        decimals: decimals,
        balance: balance,
        symbol: symbol,
        icon: icon,
      };
    }

    var instance;
    console.log(KeylinkContract.networks[networkId]);
    instance = new web3.eth.Contract(
      KeylinkContract.abi,
      KeylinkContract.networks[networkId] &&
        KeylinkContract.networks[networkId].address,
      { gasLimit: 1000000, from: account }
    );

    const allCollaterals = await instance.methods
      .getOwnedCollaterals(account)
      .call();

    const collaterals = [];

    for (let i = 0; i < allCollaterals.length; i++) {
      let collateral = await instance.methods
        .getCollateral(allCollaterals[i])
        .call();

      let symbol;
      let decimals;

      if (parseInt(collateral.token) == 0) {
        symbol = nativeToken;
        decimals = 18;
      } else {
        var erc20MetadataContract = new web3.eth.Contract(
          IERC20Metadata.abi,
          collateral.token,
          { from: account, gasLimit: 60000 }
        );
        symbol = await erc20MetadataContract.methods.symbol().call();
        decimals = await erc20MetadataContract.methods.decimals().call();
      }

      let liquidateAs = [];
      const lc = new web3.eth.Contract(
        ILiquidationCheck.abi,
        collateral.liquidation,
        { from: account, gasLimit: 60000 }
      );

      for (let j = 0; j < collateral.accounts.length; j++) {
        if (collateral.accounts[j] == account) {
          let response = await lc.methods
            .liquidationCheck(collateral.accounts, j, collateral.args)
            .call();
          if (response) {
            liquidateAs.push(j);
          }
        }
      }

      let name;
      try {
        // await nftStorageClient.check(collateral.uri);
        const gateway = "https://ipfs.io/ipfs/";

        const details = JSON.parse(
          readURL(gateway + collateral.uri + "/details.json")
        );
        name = details.name + " (" + details.service + ")";
      } catch (error) {
        console.log(error);
        name = collateral.uri;
      }

      if (parseFloat(collateral.amount) > 0) {
        collaterals.push({
          id: allCollaterals[i],
          amount: parseFloat(collateral.amount),
          symbol: symbol,
          decimals: parseFloat(decimals),
          name: name,
          accounts: collateral.accounts,
          liquidation: liquidateAs,
        });
      }
    }

    setWeb3(web3);
    setConstants(_constants);
    setAccount(account);
    setKeylinkContract(instance);
    setDelegatorContract(delegatorContract);
    setCollateralList(collaterals);
    return true;
  };

  useEffect(() => {
    document.title = "Keylinq";
    (async () => {
      if (window.ethereum) await connectWeb3();
    })();
  }, []);

  const handleBackdropClose = () => {
    setOpenBackdrop(false);
  };
  return (
    <ThemeProvider theme={mainTheme}>
      <Router>
        <Backdrop
          className={classes.backdrop}
          open={openBackdrop}
          onClick={handleBackdropClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar position="static" className="appbar">
          <Toolbar variant="dense">
            <Link to="/" style={{ textDecoration: "none", color: "#FFF" }}>
              <img src={Logo} style={{ height: 50 }} />
              {/* <Typography variant="h5" noWrap style={{ width: 200 }}>
                {page == "Express" ? "Keylink Express" : "Keylink"}
              </Typography> */}
            </Link>

            <Box className={classes.tool_bar}>
              <Link to="/info">
                <IconButton
                // onClick={() => {
                //   window.open(
                //     "https://www.notion.so/Keylinq-42a1e15b92aa458d9cea776e9db97ae7"
                //   );
                // }}
                >
                  <HelpIcon></HelpIcon>
                </IconButton>
              </Link>

              <Button
                variant="contained"
                color={account ? "disabled" : "secondary"}
                className={classes.connect_wallet}
                onClick={connectWeb3}
              >
                {account ? account.substr(0, 10) + "..." : "Connect"}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        {wrongNetwork && page != "info" ? (
          <WrongNetwork setWrongNetwork={setWrongNetwork} />
        ) : (
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <MainApp
                  collateralList={collateralList}
                  account={account}
                  classes={classes}
                  keylinkContract={keylinkContract}
                  web3={web3}
                  setOpenBackdrop={setOpenBackdrop}
                  setPage={setPage}
                />
              )}
            />

            <Route
              path="/info"
              render={() => <Info classes={classes} setPage={setPage} />}
            />

            <Route
              path="/create/"
              render={() => (
                <Create
                  keylinkContract={keylinkContract}
                  account={account}
                  web3={web3}
                  classes={classes}
                  setOpenBackdrop={setOpenBackdrop}
                  setPage={setPage}
                  constants={constants}
                  lcAddresses={lcAddresses}
                />
              )}
            ></Route>

            <Route
              path="/express/"
              render={() => (
                <Express
                  keylinkContract={keylinkContract}
                  account={account}
                  web3={web3}
                  classes={classes}
                  setOpenBackdrop={setOpenBackdrop}
                  setPage={setPage}
                />
              )}
            ></Route>

            <Route
              path="/request/"
              render={() => (
                <Request
                  keylinkContract={keylinkContract}
                  account={account}
                  web3={web3}
                  classes={classes}
                  setOpenBackdrop={setOpenBackdrop}
                  setPage={setPage}
                  constants={constants}
                />
              )}
            ></Route>

            <Route
              path="/deposit/:cid?"
              render={({ match }) => (
                <Deposit
                  keylinkContract={keylinkContract}
                  account={account}
                  web3={web3}
                  classes={classes}
                  constants={constants}
                  setOpenBackdrop={setOpenBackdrop}
                  setPage={setPage}
                  lcAddresses={lcAddresses}
                  match={match}
                />
              )}
            ></Route>
          </Switch>
        )}
      </Router>
    </ThemeProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const MainApp = ({
  collateralList,
  account,
  classes,
  keylinkContract,
  web3,
  setOpenBackdrop,
  setPage,
}) => {
  const [open, setOpen] = useState(false);

  const [col, setCol] = useState(null);
  const [ind, setInd] = useState(0);

  const handleKeyClick = (collateral, index, owned) => {
    if (owned) {
      setCol(collateral);
      setInd(index);
      setOpen(true);
    } else {
      navigator.clipboard.writeText(collateral.accounts[index]);
    }
  };

  const handleClose = async (cont) => {
    const id = col.id;
    const index = ind;
    setCol(null);
    setInd(0);
    setOpen(false);
    if (cont) {
      setOpenBackdrop(true);
      try {
        let response = await keylinkContract.methods
          .transfer(
            document.getElementById("recepient_address").value,
            id,
            index
          )
          .send();
        window.location.reload(false);
      } catch (error) {
        console.log(error);
        setOpenBackdrop(false);
      }
    }
  };

  const handleUnlock = async (col, index) => {
    setOpenBackdrop(true);
    try {
      let response = await keylinkContract.methods
        .liquidate(col.id, index)
        .send();
      window.location.reload(false);
    } catch (error) {
      console.log(error);
      setOpenBackdrop(false);
    }
  };

  useEffect(() => {
    (async () => {
      setPage("Home");
    })();
  }, []);

  return (
    <ThemeProvider theme={mainTheme}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Key Transfer</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Send key <b>{ind}</b> of "{col ? col.name : ""}" to another user?
            <TextField
              required
              id="recepient_address"
              label="Recepient Wallet Address"
              variant="outlined"
              className={classes.send_address}
            ></TextField>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={() => handleClose(true)} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <div class="center body-vertical-span">
          <div>
            {collateralList
              ? collateralList.map((collateral) => (
                  <Card className={classes.collateral_card} elevation={3}>
                    <CardContent>
                      <Typography className={classes.title_display}>
                        {collateral.name}
                      </Typography>
                      <Typography className={classes.amount_display}>
                        {collateral.amount / Math.pow(10, collateral.decimals)}{" "}
                        {collateral.symbol}
                      </Typography>
                      <Box className={classes.key_box}>
                        {collateral.accounts.map((addr, i) => (
                          <Tooltip title={addr == account ? "You" : addr}>
                            <div>
                              <IconButton
                                className={classes.key}
                                onClick={() =>
                                  handleKeyClick(collateral, i, addr == account)
                                }
                              >
                                <Key
                                  color={
                                    addr == account ? "secondary" : "disabled"
                                  }
                                />
                              </IconButton>
                              <br></br>
                            </div>
                          </Tooltip>
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        className={classes.unlock_button}
                        disabled={collateral.liquidation.length == 0}
                        onClick={() =>
                          handleUnlock(collateral, collateral.liquidation[0])
                        }
                      >
                        Unlock
                      </Button>
                    </CardActions>
                  </Card>
                ))
              : ""}

            <br />
            <div class="center">
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Link to="/create" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="secondary">
                      <EnhancedEncryptionIcon
                        style={{ padding: 5 }}
                      ></EnhancedEncryptionIcon>
                      Create Vault
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/express" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="secondary">
                      <SwapIcon style={{ padding: 5 }}></SwapIcon>
                      Payments
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </div>

            <br />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const Create = ({
  values,
  keylinkContract,
  web3,
  classes,
  setOpenBackdrop,
  account,
  setPage,
  constants,
  lcAddresses,
}) => {
  if (!web3) window.location = "/";
  const [asset, setAsset] = useState("");
  const [name, setName] = useState("");
  const [accounts, setAccounts] = useState(2);

  var [amount, setAmount] = useState(0);

  const createCollateral = async () => {
    setOpenBackdrop(true);
    let response;
    let hasApproved = false;
    let ERC20Contract;

    try {
      if (constants.assets[asset].address == "NATIVE") {
        response = await keylinkContract.methods
          .createCollateralETH(
            accounts,
            name,
            lcAddresses[0],
            web3.utils.toHex(accounts)
          )
          .send({
            value: Math.ceil(
              amount * Math.pow(10, constants.assets[asset].decimals)
            ),
          });
      } else {
        let am = Math.ceil(
          amount * Math.pow(10, constants.assets[asset].decimals)
        ).toString();

        console.log(am);

        ERC20Contract = new web3.eth.Contract(
          IERC20.abi,
          constants.assets[asset].address,
          { from: account, gasLimit: 60000 }
        );
        await ERC20Contract.methods
          .approve(keylinkContract.options.address, am)
          .send();
        hasApproved = true;

        response = await keylinkContract.methods
          .createCollateralERC20(
            constants.assets[asset].address,
            am,
            accounts,
            name,
            lcAddresses[0],
            web3.utils.toHex(accounts)
          )
          .send();
      }

      window.location = "/";
    } catch (error) {
      console.log(error);
      // if (hasApproved) {
      //   await ERC20Contract.methods.approve(keylinkContract.options.address, 0).send();
      // }
      setOpenBackdrop(false);
    }
  };

  const handleAssetSelection = (e) => {
    const val = e.target.value;
    if (val == "custom") {
      setAsset("0x0");
    } else {
      setAsset(val);
    }
  };

  useEffect(() => {
    setAsset(Object.keys(constants.assets)[0]);
  }, [constants]);

  return (
    <div class="center body-vertical-span">
      <FormControl>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className={classes.add_collateral_bar}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <Box alignItems="flex-end">
                        <WhiteTypography noWrap variant="subtitle1">
                          Create Vault
                        </WhiteTypography>
                      </Box>
                    </div>
                    <div style={{ width: "50%" }}>
                      <Box
                        className={classes.action_dialog}
                        alignItems="flex-end"
                      ></Box>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ verticalAlign: "text-top" }}>
                  Descriptor
                </TableCell>
                <TableCell>
                  <FormControl>
                    <TextField
                      label=""
                      variant="outlined"
                      size="small"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    ></TextField>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ verticalAlign: "text-top" }}>
                  Assets
                </TableCell>
                <TableCell>
                  <Select
                    onChange={handleAssetSelection}
                    variant="outlined"
                    size="small"
                    value={asset}
                  >
                    {constants
                      ? Object.keys(constants.assets).map((key, index) => (
                          <MenuItem value={key}>
                            <ListItemIcon>
                              <img
                                src={constants.assets[key].icon}
                                style={{ width: 25, height: 25 }}
                              ></img>
                            </ListItemIcon>
                            <ListItemText>
                              {key} (
                              {(
                                constants.assets[key].balance /
                                Math.pow(10, constants.assets[key].decimals)
                              ).toPrecision(5)}{" "}
                              {constants.assets[key].symbol})
                            </ListItemText>
                          </MenuItem>
                        ))
                      : ""}
                  </Select>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ verticalAlign: "text-top" }}>
                  Amount
                </TableCell>
                <TableCell>
                  <FormControl>
                    <TextField
                      label=""
                      value={amount}
                      variant="outlined"
                      size="small"
                      className={classes.amount_input}
                      onChange={(e) => parseFloat(setAmount(e.target.value))}
                    ></TextField>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ verticalAlign: "text-top" }}>
                  Keys
                </TableCell>
                <TableCell>
                  <FormControl>
                    <Select
                      onChange={(e) => {
                        setAccounts(e.target.value);
                      }}
                      variant="outlined"
                      size="small"
                      value={accounts}
                    >
                      {[...Array(4).keys()].map((val) => (
                        <option value={val + 2}>{val + 2}</option>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid container justify="flex-end">
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button>Back</Button>
            </Link>
            <Button onClick={createCollateral}>Create</Button>
          </Grid>
        </TableContainer>
      </FormControl>
    </div>
  );
};

const WrongNetwork = ({ setWrongNetwork }) => {
  return (
    <div class="center body-vertical-span">
      <Grid container justify="center">
        <Grid item>
          <ErrorLogo style={{ width: 100, height: 100 }}></ErrorLogo>
        </Grid>
        <Box width="100%"></Box>
        <Grid item justify="center">
          <Typography variant="h4" align="center">
            Please switch to supported networks to use this app.
          </Typography>
          <div class="center">
            <Link
              to="/info"
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  setWrongNetwork(false);
                }}
              >
                Learn More
              </Button>
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const Info = ({ classes, setPage }) => {
  useEffect(() => {
    setPage("info");
  }, []);
  return (
    <div class="center" style={{ marginTop: "8vh", fontFamily: "Roboto" }}>
      <FadeIn>
        <div class="center">
          <h1 style={{ lineHeight: 0.5, fontSize: 40, marginBottom: 15 }}>
            Keylinq
          </h1>
          <div class="break"></div>
          <h1 style={{ lineHeight: 0.5, fontSize: 25 }}>
            Your One-stop Shop for Smart Contracts 🤝
          </h1>
        </div>
        <div class="center">
          <Link to="/" style={{ textDecoration: "none", marginTop: 25 }}>
            <Button variant="outlined">Use App</Button>
          </Link>
        </div>
        <div class="center">
          <h3 style={{ color: "gray", marginTop: 25 }}>How Does it Work?</h3>
          <div class="break"></div>
          <div style={{ width: "35vw", textAlign: "center", lineHeight: 1.5 }}>
            <p>
              To simplify contract payments, we create (free!){" "}
              <b>virtual vaults</b> for you on the blockchain.
            </p>
            <img
              src={LandingPageArt1}
              style={{ width: 150, height: 150 }}
            ></img>
            <p></p>
            <p>
              Virtual vaults store cryptocurrencies
              <LandingPageTooltip title="Through our integration with fiat on-ramp providers, you can now purchase crypto on-the-go with credit/debit card or wire transfer without leaving the site.">
                <span>
                  {" "}
                  (<u style={{ color: "blue" }}>do not own any?</u>)
                </span>
              </LandingPageTooltip>
              , which can be unlocked with <b>keys</b>. When you first open a
              vault, you gain access to a set of non-duplicable keys. You can
              then <b>transfer</b> these keys to other users or smart contracts,
              depending on your use case.
            </p>

            <img
              src={LandingPageArt2}
              style={{ width: 200, height: 200 }}
            ></img>
            <p>
              Finally, funds in vaults can be <b>liquidated</b> based on the
              vault's liquidation rule. For instance, the liquidator may be
              required to own
              <b> any key</b>, <b>all keys</b>, or <b>specific keys</b>.
            </p>
            <img
              src={LandingPageArt3}
              style={{ width: 150, height: 150 }}
            ></img>
          </div>
        </div>
        <div class="center">
          <h3 style={{ color: "gray", marginTop: 50 }}>Use Cases</h3>
          <div class="break"></div>
          <div style={{ width: "25vw", textAlign: "center", lineHeight: 1.5 }}>
            <p>
              <b>Commission/contract work</b>
            </p>
            <img
              src={LandingPageArt4a}
              style={{ width: 100, height: 100 }}
            ></img>
            <p style={{ textAlign: "justify" }}>
              Buyer commissions work from contract worker. Contract worker sends
              a Keylinq request for buyer to open an <b>all keys</b> vault with
              required amount. First key is automatically sent to worker, while
              second key is sent by buyer upon work completion.
            </p>
          </div>
          <div style={{ width: "10vw" }}></div>
          <div style={{ width: "25vw", textAlign: "center", lineHeight: 1.5 }}>
            <p>
              <b>Safe money transfer</b>
            </p>
            <img
              src={LandingPageArt4b}
              style={{ width: 125, height: 100 }}
            ></img>
            <p style={{ textAlign: "justify" }}>
              Ever worried that you will send your crypto to the wrong address?
              Using our SafeTransfer feature, you can instead transfer to an{" "}
              <b>any key</b> vault, and hand one key over to your recepient.
              Both sides can unlock with a single key.
            </p>
          </div>
        </div>
        <div class="center">
          <h3 style={{ color: "gray", marginTop: 50 }}>Roadmap</h3>

          <div class="break"></div>
          <div style={{ width: "25vw", textAlign: "center", lineHeight: 1.5 }}>
            <div class="center">
              <span>
                <b>Chainlink integration</b>
              </span>
              <img
                src={ChainlinkLogo}
                style={{ width: 25, height: 29, marginLeft: 10 }}
              ></img>
            </div>
            <p style={{ textAlign: "justify" }}>
              We will integrate with Chainlink to allow for oracle-based
              automatic key transfer. As a user, you can transfer a key to the
              Keylinq Oracle Delegator with a specified third-party data
              endpoint. The Delegator will then delegate the key according to
              specified conditions, enabling conditional payments (e.g. upon
              task completion or package delivery).
            </p>
          </div>
          <div class="break"></div>
          <div style={{ textAlign: "center", lineHeight: 1.5 }}>
            <b>Available on:</b>
            <Grid container>
              <Grid item>
                <Paper
                  style={{
                    background:
                      "linear-gradient(90deg, #413C3C 30%, #403721 90%)",
                    color: "white",
                    margin: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    alignItems: "center",
                    display: "flex",
                  }}
                  elevation={3}
                >
                  <img
                    src={require("./resources/bnb_logo.png")}
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  ></img>{" "}
                  BSC (Testnet)
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(60, 60, 80) 30%, rgb(50, 50, 60) 90%)",
                    color: "white",
                    margin: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    alignItems: "center",
                    display: "flex",
                  }}
                  elevation={3}
                >
                  <img
                    src={require("./resources/ethereum_logo.png")}
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  ></img>{" "}
                  Ethereum (Rinkeby)
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(80, 60, 80) 30%, rgb(65, 40, 60) 90%)",
                    color: "white",
                    margin: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    alignItems: "center",
                    display: "flex",
                  }}
                  elevation={3}
                >
                  <img
                    src={require("./resources/polygon_logo.png")}
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  ></img>{" "}
                  Polygon (Testnet)
                </Paper>
              </Grid>
            </Grid>
            <div style={{ height: 100 }}></div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
export default withStyles(styles)(App);
