import React from "react";
import { Link } from "react-router-dom";
import { Button, Paper, Typography, useTheme } from "@mui/material";
import Mask from "../resources/Mask";
import config from "../config.json";

import { twquery } from "../api/TwetchGraph";

export default function Auth() {
  //const history = useHistory();
  const host = window.location.host;
  const TwetchLogin = (e) => {
    // config
    let redirectUrl = `https://${host}/auth/callback/twetch`;
    let appName = config.appIdentity.title;
    e.preventDefault();
    window.location.href = `https://twetch.app/auth/authorize?appName=${appName}&redirectUrl=${redirectUrl}`;
  };

  /* const HandCashLogin = (e) => {
    e.preventDefault();
    window.location.href = redirectionLoginUrl;
  }; */

  /* const MBLogin = async () => {
    // is also in TwetchAction component

    let getPermissionForCurrentUser = () => {
      return localStorage.token;
    };
    const imb = new window.moneyButton.IMB({
      clientIdentifier: imbCli,
      permission: getPermissionForCurrentUser(),
      onNewPermissionGranted: (token) => localStorage.setItem("token", token)
    });
    if (!localStorage.getItem("tokenTwetchAuth")) {
      fetch("https://auth.twetch.app/api/v1/challenge")
        .then(function (res) {
          return res.json();
        })
        .then(async (resp) => {
          var cryptoOperations = [
            {
              name: "mySignature",
              method: "sign",
              data: resp.message,
              dataEncoding: "utf8",
              key: "identity",
              algorithm: "bitcoin-signed-message"
            },
            { name: "myPublicKey", method: "public-key", key: "identity" },
            { name: "myAddress", method: "address", key: "identity" }
          ];
          imb.swipe({
            cryptoOperations: cryptoOperations,
            onCryptoOperations: async (ops) => {
              saveWallet(ops[1].paymail, "moneybutton");
              if (localStorage.getItem("paymail")) {
                twLogin(ops[2].value, resp.message, ops[0].value, () => {
                  history.push("/");
                });
              }
            }
          });
        });
    } else {
      history.push("/");
    }
  };
  const RelayXLogin = async () => {
    let token = await window.relayone.authBeta({ withGrant: true }),
      res;
    localStorage.setItem("token", token);
    let [payload, signature] = token.split(".");
    //console.log(signature);
    const data = JSON.parse(atob(payload));

    fetch("https://auth.twetch.app/api/v1/challenge", { method: "get" })
      .then((res) => {
        return res.json();
      })
      .then(async (resp) => {
        try {
          res = await window.relayone.sign(resp.message);
          const publicKey = window.bsv.PublicKey.fromHex(data.pubkey);
          const signAddr = window.bsv.Address.fromPublicKey(
            publicKey
          ).toString();
          if (res) {
            saveWallet(data.paymail, "relayx");
            if (localStorage.getItem("paymail")) {
              twLogin(signAddr, resp.message, res.value, () => {
                history.push("/");
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
  }; */
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        padding: "0 16px",
        maxWidth: "100%",
        maxHeight: "100%",
        flexDirection: "column"
      }}
    >
      <div style={{ flexGrow: 1 }} />
      <Paper
        elevation={9}
        style={{
          width: "600px",
          margin: "0 auto",
          padding: "36px 44px",
          maxWidth: "100%",
          borderRadius: "6px"
        }}
      >
        <Mask style={{ alignContent: "center" }} />
        <Typography
          variant="body1"
          style={{
            paddingTop: "21px",
            margin: "0 auto",
            fontSize: "18px",
            textAlign: "center",
            lineHeight: "20px"
          }}
        >
          {config.appIdentity.subtitle}
        </Typography>
        <div
          style={{
            width: "100%",
            margin: "20px auto 0 auto",
            display: "block",
            maxWidth: "300px"
          }}
        >
          <Button
            style={{
              color: "white",
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              boxShadow: "none !important",
              fontWeight: 600,
              lineHeight: "24px",
              borderRadius: "6px",
              textTransform: "none"
            }}
            variant="contained"
            color="primary"
            onClick={TwetchLogin}
          >
            Se connecter avec Twetch
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            margin: "20px auto 0 auto",
            display: "block",
            maxWidth: "300px"
          }}
        >
          <Button
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              boxShadow: "none !important",
              fontWeight: 600,
              lineHeight: "24px",
              borderRadius: "6px",
              textTransform: "none",
              textAlign: "center"
            }}
            variant="outlined"
            color="primary"
            href={config.ownerInfo.inviteLink}
            target="_blank"
          >
            Je n'ai pas de compte Twetch
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            margin: "20px auto 0 auto",
            display: "block",
            maxWidth: "300px"
          }}
        >
          <div
            style={{
              width: "100%",
              margin: "20px auto 0 auto",
              display: "block",
              maxWidth: "300px"
            }}
          >
            {/* <Link className="Links" to="/">
              <p
                style={{
                  color: theme.palette.primary.main,
                  margin: "0 auto",
                  fontSize: "18px",
                  textAlign: "center",
                  lineHeight: "20px"
                }}
              >
                Navigate anonymously
              </p>
            </Link> */}
          </div>
        </div>
      </Paper>
      <div style={{ flexGrow: 1 }} />
    </div>
  );
}

export const saveWallet = (paymail, wallet) => {
  localStorage.setItem("paymail", paymail);
  localStorage.setItem("wallet", wallet);
};

export const twLogin = (address, message, signature, callback) => {
  let obj = { address, message, signature };
  fetch("https://auth.twetch.app/api/v1/authenticate", {
    method: "post",
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json" }
  })
    .then((res) => {
      return res.json();
    })
    .then(async (resp) => {
      //console.log(resp);
      localStorage.setItem("tokenTwetchAuth", resp.token);
      let { me } = await twquery(`{ me { id icon name } }`);
      //console.log({ me });
      localStorage.setItem("id", me.id);
      localStorage.setItem("icon", me.icon);
      localStorage.setItem("name", me.name);
      callback();
    });
};
