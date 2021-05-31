import React, { useState } from "react";
import { Button } from "reactstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory, Redirect } from "react-router-dom";
import { css } from "@emotion/react";
import PropagateLoader from "react-spinners/PropagateLoader";

if (
  (typeof TextDecoder === "undefined" || typeof TextEncoder === "undefined") &&
  typeof require !== "undefined"
) {
  global.TextDecoder = require("util").TextDecoder;
  global.TextEncoder = require("util").TextEncoder;
}

const Download = () => {
  const [download_url, setURL] = useState(undefined);
  const [isLoading, changeIsLoading] = useState(false);
  const { urlId } = useParams();
  const history = useHistory();

  async function getHash() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.REACT_APP_BACKENDURL}/${urlId}`, {
          headers: {
            "X-Api-Key": process.env.REACT_APP_APIKEY,
          },
        })
        .then(
          (response) => {
            if (response.data.statusCode == 500 || response.data.error) {
              toast.error(response.data.error);
              history.push("/");
            }
            resolve(response.data.body);
          },
          (error) => {
            toast.error("Internal Server Error");
            history.urlClickedpush("/");
            reject(error);
          }
        );
    });
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank");
    if (newWindow) newWindow.opener = null;
  };

  async function downloadFile() {
    document.title = "Loading";
    changeIsLoading(true);
    const hash = await getHash();
    const url = `https://ipfs.io/ipfs/${hash}`;
    const response = await axios({
      method: "get",
      url: url,
      responseType: "arraybuffer",
    });
    var blob = new Blob([response.data], {
      type: `${response.headers["content-type"]}`,
    });
    document.title = `${process.env.REACT_APP_TITLE}`;
    setURL(URL.createObjectURL(blob));
    changeIsLoading(false);
  }
  return (
    <div className="container pt-2 text-center">
      {!download_url && isLoading ? (
        <div class="d- flex justify-content-center">
          <PropagateLoader color="purple" loading="true" size={15} />
        </div>
      ) : null}
      {download_url && !isLoading ? (
        <div class="container">
          {openInNewTab(download_url)}
          <h1>Download successful</h1>
          <p>
            Your file has been downloaded. Please reload the page to download
            the file again.
          </p>
        </div>
      ) : null}
      {!download_url && !isLoading ? (
        <Button
          color="success"
          hidden={download_url ? true : false}
          onClick={() => {
            downloadFile();
          }}
        >
          {" "}
          Download{" "}
        </Button>
      ) : null}
    </div>
  );
};

export default Download;
