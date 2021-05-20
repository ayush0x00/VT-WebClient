import React, { useState} from "react";
import {Button} from "reactstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { Loading } from '../Loading';
import { useHistory} from 'react-router-dom';
if (
  (typeof TextDecoder === "undefined" || typeof TextEncoder === "undefined") &&
  typeof require !== "undefined"
) {
  global.TextDecoder = require("util").TextDecoder;
  global.TextEncoder = require("util").TextEncoder;
}
// const ipfs = require("ipfs-http-client");
// const client = ipfs({ host: "ipfs.infura.io", port: 5001, protcol: "https" });

const Download = () => {
    const [download_url, setURL] = useState(undefined);
    const [downloading, isDownloading]=useState(false)
    const { urlId } = useParams();
    const history=useHistory()
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
                    if(response.data.statusCode==404){
                        toast.error(response.data.body);
                        history.push("/");
                    }
                    resolve(response.data.body);
                },
                (error) => {
                    toast.error("Internal Server Error");
                    history.push("/");
                    reject(error);
                }
            );
        });
    }

    async function downloadFile() {
        isDownloading(true);
        document.title="Loading"
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
        document.title=`${process.env.REACT_APP_TITLE}`
        setURL(URL.createObjectURL(blob));
        isDownloading(false)
    }
    return (
      <div class="container">
        {downloading?(
          <div class="container">
            <Loading />
            <h1>Your file is being downloaded</h1>
          </div>
      ):
        (
          <div className="container pt-2 text-center">
            <Button hidden={download_url?true:false} onClick={()=>{downloadFile()}}> Get File </Button>
            <a hidden={download_url?false:true} className="btn btn-success" href={download_url}> View File </a>
        </div>
      )}
      </div>
    )
};

export default Download;
