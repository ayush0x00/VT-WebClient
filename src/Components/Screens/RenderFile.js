import React, { useState } from 'react';
import { Card, Button, CardTitle, CardText, Col, Tooltip,
    Modal,ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Link} from 'react-router-dom';
import date from "date-and-time";
import axios from 'axios';
import { toast } from 'react-toastify';

const crypto = require('crypto');

const RenderFile = ({file}) => {
    const [isFileViewMoreTipOpen,setIsFileViewMoreTipOpen] = useState(false);
    const [isFileShareTipOpen, setIsFileShareTipOpen] = useState(false);
    const [isFileShareModalOpen,setIsFileShareModalOpen] = useState(false);
    const [isURLLinkModalOpen, setIsURLLinkModalOpen] = useState(false);
    const [URLVisibility,setURLVisibility] = useState(true);
    const [URLId,setURLId] = useState("");
    const toggleFileViewMoreTip = () =>{
        setIsFileViewMoreTipOpen(!isFileViewMoreTipOpen);
    }
    const toggleFileShareTip = () =>{
        setIsFileShareTipOpen(!isFileShareTipOpen);
    }
    const toggleFileShareModal = () =>{
        setIsFileShareModalOpen(!isFileShareModalOpen);
    }
    const toggleURLLinkModal = () =>{
        setIsURLLinkModalOpen(!isURLLinkModalOpen);
    }
    const code = (string) =>{        
        // hash = crypto.getHashes();
        return crypto.createHash('sha1').update(string).digest('hex');
    }
    const shareFileUtil = ()=>{
        var URLData={
            hash:file.hash,
            visible:URLVisibility,
            clicks_left:50
        }
        axios.post(
            `${process.env.REACT_APP_BACKENDURL}/file/${fileId}/url`,URLData,
            {
                headers:{
                    'X-Api-Key':process.env.REACT_APP_APIKEY,
                }
            }
        ).then((response)=>{                                    
            toast.success("URL Generated Successfully");   
            setURLId(response.data.body);  
            toggleFileShareModal();    
            toggleURLLinkModal();   
        }, (error) => {
            toast.error("Some error occured");
        })
        setURLVisibility(true);
    }
    var fileId=file.SK.substring(5)
    var now=date.parse(fileId,'YYYY-MM-DD-hh-mm-ss');
    now=date.format(now, 'ddd, MMM DD, YYYY H:mm');
    var idTemp="id"+code(fileId)
    return(
        <Col sm="6" className="p-2" key={file.SK}>
            <Card body>
                <div className="col-12">
                    <div className="float-left">
                        <CardTitle tag="h5">{file.LS1_SK}</CardTitle>
                    </div>
                    <div className="float-right">
                        <span className="mx-1" role="button" className="fa fa-share-alt" id={"share"+idTemp} onClick={toggleFileShareModal}></span>     
                        <Tooltip placement="right" isOpen={isFileShareTipOpen} target={"share"+idTemp} toggle={toggleFileShareTip}>
                            Share File
                        </Tooltip>                   
                        <Link to={`/file/${fileId}`} className="text-decoration-none">                        
                            <Button className="rounded-circle ml-2" id={"viewMore"+idTemp}>
                                <span className="fa fa-angle-double-right"></span>
                                <Tooltip placement="right" isOpen={isFileViewMoreTipOpen} target={"viewMore"+idTemp} toggle={toggleFileViewMoreTip}>
                                    File Details
                                </Tooltip>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="col-12">
                    <CardText>Created at: {now}
                        <br/>
                        <span className="rounded-pill primary-text mr-1 col-3 file-type-badge">{file.f_type}</span>
                        <span className="rounded-pill primary-text ml-1 col-3 file-size-badge">{file.size} MB</span>
                    </CardText>                                          
                </div>
                <Modal isOpen={isFileShareModalOpen} toggle={toggleFileShareModal} className="modal-dialog-centered">
                    <ModalHeader toggle={toggleFileShareModal}>Share File {file.LS1_SK}</ModalHeader>
                    <ModalBody>
                        URL Visibility                        
                        <form>                            
                            <label>
                                <input type="radio" checked={!URLVisibility} onClick={()=>setURLVisibility(false)} />
                                Private 
                            </label>                            
                            <label className="ml-2">
                                <input type="radio" checked={URLVisibility} onClick={()=>setURLVisibility(true)}/>
                                Public
                            </label>                            
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={shareFileUtil}>
                            Create Link
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={isURLLinkModalOpen} toggle={toggleURLLinkModal} className="modal-dialog-centered">
                    <ModalHeader toggle={toggleURLLinkModal}>File Link</ModalHeader>
                    <ModalBody>  
                    <Link to={process.env.REACT_APP_FRONTENDURL+"/"+URLId} className="text-decoration-none" onClick={toggleURLLinkModal}>                       
                        {process.env.REACT_APP_FRONTENDURL+"/"+URLId}   
                    </Link>                       
                    </ModalBody>                    
                </Modal>       
            </Card>
        </Col>
    )
}
 
export default RenderFile;